import Payment from '../models/payment.js';
import Student from '../models/student.js';
import Course from '../models/course.js';
import { buildReceiptPDF } from '../services/pdfService.js';

// @desc    Simulate/Create new payment transaction
// @route   POST /api/payments
// @access  Private
export const createPayment = async (req, res, next) => {
  try {
    const { studentId, amount, type, method } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const txId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const recNo = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

    const payment = await Payment.create({
      student: studentId,
      amount: Number(amount),
      type,
      method,
      status: 'Success',
      transactionId: txId,
      receiptNumber: recNo,
      paymentDate: new Date(),
    });

    // Update student paid fees tracker
    // Also set hostel or transport parameters if it is hostel/transport payment
    if (type === 'Hostel') {
      student.hostelAllocated = true;
      student.hostelRoomNumber = `Room ${Math.floor(100 + Math.random() * 899)}`;
    } else if (type === 'Transport') {
      student.transportAllocated = true;
      student.transportRoute = `Route-${Math.floor(1 + Math.random() * 9)}`;
    }

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Payment completed successfully (Simulated)',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payments (Admin gets all, Student gets their own)
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res, next) => {
  try {
    let filter = {};

    // If user is a student, filter by their student profile id
    if (req.user.role === 'Student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
      filter.student = student._id;
    } else if (req.query.studentId) {
      filter.student = req.query.studentId;
    }

    const payments = await Payment.find(filter)
      .populate({
        path: 'student',
        populate: { path: 'course' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Download payment receipt PDF
// @route   GET /api/payments/:id/receipt
// @access  Private
export const downloadReceipt = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('student');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const student = await Student.findById(payment.student._id).populate('course');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${payment.receiptNumber}.pdf`);

    buildReceiptPDF(res, payment, student, student.course);
  } catch (error) {
    next(error);
  }
};
