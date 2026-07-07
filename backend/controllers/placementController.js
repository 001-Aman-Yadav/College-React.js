import JobDrive from '../models/jobDrive.js';
import Student from '../models/student.js';

// @desc    Get all placement drives
// @route   GET /api/placements
// @access  Private
export const getJobDrives = async (req, res, next) => {
  try {
    const drives = await JobDrive.find().sort({ driveDate: 1 });
    res.status(200).json({ success: true, count: drives.length, data: drives });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new placement drive
// @route   POST /api/placements
// @access  Private/Admin
export const createJobDrive = async (req, res, next) => {
  try {
    const { companyName, role, packageAmount, description, eligibility, driveDate } = req.body;
    if (!companyName || !role || !packageAmount || !description || !eligibility || !driveDate) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const drive = await JobDrive.create({
      companyName,
      role,
      packageAmount: Number(packageAmount),
      description,
      eligibility,
      driveDate: new Date(driveDate),
    });

    res.status(201).json({ success: true, message: 'Placement drive posted successfully', data: drive });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a placement drive
// @route   DELETE /api/placements/:id
// @access  Private/Admin
export const deleteJobDrive = async (req, res, next) => {
  try {
    const drive = await JobDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    await JobDrive.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Placement drive deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update applicant status in drive
// @route   PUT /api/placements/:driveId/applicants/:studentId
// @access  Private/Admin
export const updateApplicantStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { driveId, studentId } = req.params;

    const drive = await JobDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    const applicant = drive.applicants.find(
      (app) => app.student.toString() === studentId.toString()
    );

    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant record not found' });
    }

    applicant.status = status;
    await drive.save();

    res.status(200).json({ success: true, message: 'Applicant status updated successfully', data: drive });
  } catch (error) {
    next(error);
  }
};
