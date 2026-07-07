import Student from '../models/student.js';
import Course from '../models/course.js';
import JobDrive from '../models/jobDrive.js';
import StudyMaterial from '../models/studyMaterial.js';
import { buildIDCardPDF } from '../services/pdfService.js';
import PDFDocument from 'pdfkit';

// @desc    Get current student profile
// @route   GET /api/students/profile
// @access  Private/Student
export const getStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('course');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students list
// @route   GET /api/students
// @access  Private/Admin
export const getStudents = async (req, res, next) => {
  try {
    const { search, course, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (course) {
      query.course = course;
    }

    if (status) {
      query.status = status;
    }

    const count = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('course')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count,
      page: Number(page),
      pages: Math.ceil(count / limit),
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private/Admin
export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Download Student Digital ID Card PDF
// @route   GET /api/students/:id/idcard
// @access  Private
export const downloadIDCard = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('course');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=idcard_${student.rollNumber || 'pending'}.pdf`);

    buildIDCardPDF(res, student, student.course);
  } catch (error) {
    next(error);
  }
};

// @desc    Download Student Bonafide Certificate PDF
// @route   GET /api/students/:id/bonafide
// @access  Private
export const downloadBonafide = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('course');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=bonafide_${student.rollNumber || 'student'}.pdf`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    // Primary Colors
    const primaryColor = '#1e3a8a';
    const secondaryColor = '#4b5563';

    // Top Border Header
    doc.rect(0, 0, 595.28, 15).fill(primaryColor);

    doc.moveDown(3);
    doc.fillColor(primaryColor).fontSize(24).text('METROPOLITAN UNIVERSITY', { align: 'center', bold: true });
    doc.fontSize(10).fillColor(secondaryColor).text('123 Education Campus, New Delhi - 110001', { align: 'center' });
    doc.moveDown(2);

    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e5e7eb').lineWidth(1).stroke();
    doc.moveDown(3);

    // Title
    doc.fillColor('#1f2937').fontSize(16).text('BONAFIDE CERTIFICATE', { align: 'center', underline: true, bold: true });
    doc.moveDown(2);

    // Date
    doc.fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`, 50, doc.y, { align: 'right' });
    doc.moveDown(2);

    // Body text
    const text = `This is to certify that Mr./Ms. ${student.firstName} ${student.lastName}, child of Shri. ${student.fatherName}, is a bonafide student of this institution. He/She has been admitted to the ${student.course.name} (${student.course.duration}) program in our college.\n\nHis/Her official Roll Number is ${student.rollNumber || 'PENDING'} and the Admission Number is ${student.admissionNumber || 'PENDING'}.\n\nAccording to college records, he/she is currently in active status and bears a good moral character. This certificate is issued upon the request of the student for official verification / scholarship application purposes.`;

    doc.fontSize(12).fillColor('#1f2937').text(text, 50, doc.y, {
      align: 'justify',
      lineGap: 6,
      width: 495,
    });

    doc.moveDown(6);

    // Signature Block
    doc.fontSize(11).text('Prof. Rajesh Kumar', 400, doc.y, { align: 'center' });
    doc.text('Registrar & Dean of Student Affairs', 350, doc.y + 15, { align: 'center' });
    doc.moveTo(370, doc.y - 5).lineTo(530, doc.y - 5).strokeColor('#9ca3af').stroke();

    doc.end();
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for leave
// @route   POST /api/students/leave
// @access  Private/Student
export const applyStudentLeave = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { startDate, endDate, reason } = req.body;
    student.leaves = student.leaves || [];
    student.leaves.push({ startDate, endDate, reason, status: 'Pending' });
    await student.save();

    res.status(200).json({ success: true, data: student.leaves });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a complaint
// @route   POST /api/students/complaint
// @access  Private/Student
export const submitStudentComplaint = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { category, subject, content } = req.body;
    student.complaints = student.complaints || [];
    student.complaints.push({ category, subject, content, status: 'Pending', reply: '' });
    await student.save();

    res.status(200).json({ success: true, data: student.complaints });
  } catch (error) {
    next(error);
  }
};

// @desc    Request/Borrow a library book
// @route   POST /api/students/library
// @access  Private/Student
export const requestLibraryBook = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { bookTitle, author } = req.body;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    student.libraryBooks = student.libraryBooks || [];
    student.libraryBooks.push({
      bookTitle,
      author,
      issueDate: new Date(),
      dueDate,
      status: 'Issued'
    });
    await student.save();

    res.status(200).json({ success: true, data: student.libraryBooks });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for placement drive
// @route   POST /api/students/placements/:driveId/apply
// @access  Private/Student
export const applyJobDrive = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const drive = await JobDrive.findById(req.params.driveId);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Job drive not found' });
    }

    // Check if already applied
    const alreadyApplied = drive.applicants.some(
      (app) => app.student.toString() === student._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied for this drive.' });
    }

    drive.applicants.push({
      student: student._id,
      appliedAt: new Date(),
      status: 'Applied',
    });
    await drive.save();

    res.status(200).json({ success: true, message: 'Successfully applied for the placement drive.', data: drive });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student syllabus study materials
// @route   GET /api/students/study-materials
// @access  Private/Student
export const getStudyMaterials = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Find study materials matching student course
    const materials = await StudyMaterial.find({ course: student.course }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: materials.length, data: materials });
  } catch (error) {
    next(error);
  }
};
