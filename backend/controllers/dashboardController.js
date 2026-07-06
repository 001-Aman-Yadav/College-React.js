import Student from '../models/student.js';
import Teacher from '../models/teacher.js';
import Course from '../models/course.js';
import Payment from '../models/payment.js';

// @desc    Get aggregated stats for Admin Dashboard
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments({ status: 'Approved' });
    const totalPendingAdmissions = await Student.countDocuments({ status: 'Pending' });
    const totalTeachers = await Teacher.countDocuments();
    const totalCourses = await Course.countDocuments();

    // Calculate revenue
    const revenueResult = await Payment.aggregate([
      { $match: { status: 'Success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Coursewise students distribution
    const courseStats = await Student.aggregate([
      { $match: { status: 'Approved' } },
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'courseDetails',
        },
      },
      { $unwind: '$courseDetails' },
      {
        $project: {
          courseName: '$courseDetails.name',
          count: 1,
        },
      },
    ]);

    // Categorywise student distribution
    const categoryStats = await Student.aggregate([
      { $match: { status: 'Approved' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent payments
    const recentPayments = await Payment.find()
      .populate({
        path: 'student',
        select: 'firstName lastName email',
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent registrations
    const recentRegistrations = await Student.find({ status: 'Pending' })
      .populate('course')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totals: {
          totalStudents,
          totalPendingAdmissions,
          totalTeachers,
          totalCourses,
          totalRevenue,
        },
        charts: {
          courseStats,
          categoryStats,
        },
        recentPayments,
        recentRegistrations,
      },
    });
  } catch (error) {
    next(error);
  }
};
