import mongoose from '../config/pg-mongoose.js';

const jobDriveSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    packageAmount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    eligibility: {
      type: String,
      required: true,
    },
    driveDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled'],
      default: 'Active',
    },
    applicants: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['Applied', 'Shortlisted', 'Selected', 'Rejected'],
          default: 'Applied',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const JobDrive = mongoose.model('JobDrive', jobDriveSchema);
export default JobDrive;
