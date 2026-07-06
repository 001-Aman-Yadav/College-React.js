import Notice from '../models/notice.js';

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
export const getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private/AdminOrTeacher
export const createNotice = async (req, res, next) => {
  try {
    const { title, content, category, priority, pdfUrl } = req.body;

    const notice = await Notice.create({
      title,
      content,
      category,
      priority,
      pdfUrl,
      postedBy: req.user.role,
    });

    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
export const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    next(error);
  }
};
