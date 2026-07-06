import Teacher from '../models/teacher.js';
import User from '../models/user.js';
import Student from '../models/student.js';

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private/Admin
export const getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json({ success: true, count: teachers.length, data: teachers });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new teacher
// @route   POST /api/teachers
// @access  Private/Admin
export const createTeacher = async (req, res, next) => {
  try {
    const { firstName, lastName, email, mobile, department, qualification, salary, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create Teacher profile
    const teacher = await Teacher.create({
      firstName,
      lastName,
      email,
      mobile,
      department,
      qualification,
      salary: Number(salary),
      status: 'Active',
    });

    // Create User login credentials
    const user = await User.create({
      email,
      password: password || 'teacher123',
      role: 'Teacher',
      status: 'Active',
      profileReference: teacher._id,
      roleReferenceModel: 'Teacher',
    });

    // Link back to user
    teacher.user = user._id;
    await teacher.save();

    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

// @desc    Update teacher profile details
// @route   PUT /api/teachers/:id
// @access  Private/Admin
export const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

// @desc    Enter student exam results (Grade card entry)
// @route   POST /api/teachers/enter-marks
// @access  Private/Teacher
export const enterMarks = async (req, res, next) => {
  try {
    const { studentId, semester, gpa, subjects } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Check if result for this semester already exists, if so overwrite or append
    const resultIdx = student.results.findIndex((r) => r.semester === Number(semester));
    const newResult = { semester: Number(semester), gpa: Number(gpa), subjects };

    if (resultIdx > -1) {
      student.results[resultIdx] = newResult;
    } else {
      student.results.push(newResult);
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Marks entered and grade card generated successfully',
      data: student.results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher profile
// @route   GET /api/teachers/profile
// @access  Private/Teacher
export const getTeacherProfile = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students in teacher scope
// @route   GET /api/teachers/students
// @access  Private/Teacher
export const getTeacherStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ status: 'Approved' }).populate('course');
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

// @desc    Record student attendance
// @route   POST /api/teachers/attendance
// @access  Private/Teacher
export const recordAttendance = async (req, res, next) => {
  try {
    const { attendanceRecords } = req.body;
    if (!Array.isArray(attendanceRecords)) {
      return res.status(400).json({ success: false, message: 'Invalid attendance data format' });
    }

    for (const record of attendanceRecords) {
      const student = await Student.findById(record.studentId);
      if (student) {
        const currentAtt = student.attendance || 85;
        if (record.present) {
          student.attendance = Math.min(100, Math.round((currentAtt * 30 + 100) / 31));
        } else {
          student.attendance = Math.max(0, Math.round((currentAtt * 30 + 0) / 31));
        }
        await student.save();
      }
    }

    res.status(200).json({ success: true, message: 'Attendance recorded successfully' });
  } catch (error) {
    next(error);
  }
};
