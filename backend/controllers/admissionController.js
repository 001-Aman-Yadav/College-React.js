import Student from '../models/student.js';
import User from '../models/user.js';
import Course from '../models/course.js';
import { sendAdmissionConfirmationEmail, sendAdmissionApprovalEmail } from '../services/emailService.js';

// Helper to generate unique application number
const generateApplicationNumber = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `APP-${year}-${rand}`;
};

// Helper to generate admission & roll numbers
const generateAdmissionNumber = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ADM-${year}-${rand}`;
};

const generateRollNumber = (courseCode) => {
  const year = new Date().getFullYear().toString().slice(-2);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${courseCode}-${year}-${rand}`;
};

// @desc    Submit online admission application
// @route   POST /api/admission/apply
// @access  Public
export const applyAdmission = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      fatherName,
      motherName,
      dob,
      gender,
      category,
      religion,
      nationality,
      email,
      mobile,
      address,
      state,
      district,
      pinCode,
      courseId,
      previousQualification,
      marks10th,
      marks12th,
      graduationMarks,
      password,
    } = req.body;

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email address is already registered' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Select a valid course' });
    }

    if (course.availableSeats <= 0) {
      return res.status(400).json({ success: false, message: 'No seats available for this course' });
    }

    const appNo = generateApplicationNumber();

    // Setup mock file paths if files are uploaded
    const documents = {
      photo: req.files?.photo ? `/uploads/${req.files.photo[0].filename}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      signature: req.files?.signature ? `/uploads/${req.files.signature[0].filename}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      aadhar: req.files?.aadhar ? `/uploads/${req.files.aadhar[0].filename}` : '/uploads/mock_pdf.pdf',
      marksheet: req.files?.marksheet ? `/uploads/${req.files.marksheet[0].filename}` : '/uploads/mock_pdf.pdf',
      transferCertificate: req.files?.transferCertificate ? `/uploads/${req.files.transferCertificate[0].filename}` : '',
      migrationCertificate: req.files?.migrationCertificate ? `/uploads/${req.files.migrationCertificate[0].filename}` : '',
      incomeCertificate: req.files?.incomeCertificate ? `/uploads/${req.files.incomeCertificate[0].filename}` : '',
      casteCertificate: req.files?.casteCertificate ? `/uploads/${req.files.casteCertificate[0].filename}` : '',
    };

    // Create Student Record
    const student = await Student.create({
      applicationNumber: appNo,
      firstName,
      lastName,
      fatherName,
      motherName,
      dob,
      gender,
      category,
      religion,
      nationality: nationality || 'Indian',
      email,
      mobile,
      address,
      state,
      district,
      pinCode,
      course: courseId,
      previousQualification,
      marks10th: Number(marks10th),
      marks12th: Number(marks12th),
      graduationMarks: graduationMarks ? Number(graduationMarks) : undefined,
      documents,
      status: 'Pending',
    });

    // Create User account linked to the student
    const user = await User.create({
      email,
      password,
      role: 'Student',
      status: 'Active',
      profileReference: student._id,
      roleReferenceModel: 'Student',
    });

    // Link User to Student
    student.user = user._id;
    await student.save();

    // Send confirmation email
    await sendAdmissionConfirmationEmail(email, `${firstName} ${lastName}`, appNo, course.name);

    res.status(201).json({
      success: true,
      message: 'Admission form submitted successfully. Verify check email.',
      applicationNumber: appNo,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all admission applications (Filtered by status)
// @route   GET /api/admission
// @access  Private/Admin
export const getAdmissions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const applications = await Student.find(filter).populate('course');
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve student admission
// @route   PUT /api/admission/:id/approve
// @access  Private/Admin
export const approveAdmission = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('course');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student application not found' });
    }

    if (student.status !== 'Pending') {
      return res.status(400).json({ success: false, message: `Application has already been ${student.status.toLowerCase()}` });
    }

    const course = await Course.findById(student.course._id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Enrolled course not found' });
    }

    if (course.availableSeats <= 0) {
      return res.status(400).json({ success: false, message: 'No seats left in this course to approve new admissions' });
    }

    // Generate Admission and Roll numbers
    const admNo = generateAdmissionNumber();
    const rollNo = generateRollNumber(course.code);

    student.admissionNumber = admNo;
    student.rollNumber = rollNo;
    student.status = 'Approved';
    await student.save();

    // Deduct seat
    course.availableSeats -= 1;
    await course.save();

    // Send email
    await sendAdmissionApprovalEmail(student.email, `${student.firstName} ${student.lastName}`, admNo, rollNo);

    res.status(200).json({
      success: true,
      message: 'Admission approved successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject student admission
// @route   PUT /api/admission/:id/reject
// @access  Private/Admin
export const rejectAdmission = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student application not found' });
    }

    if (student.status !== 'Pending') {
      return res.status(400).json({ success: false, message: `Application has already been ${student.status.toLowerCase()}` });
    }

    student.status = 'Rejected';
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Admission application rejected successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};
