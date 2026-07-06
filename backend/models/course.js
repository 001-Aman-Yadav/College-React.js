import mongoose from '../config/pg-mongoose.js';

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    duration: {
      type: String, // e.g. "3 Years"
      required: true,
    },
    fees: {
      type: Number, // per year
      required: true,
    },
    semesterFees: {
      type: Number,
      required: true,
    },
    registrationFees: {
      type: Number,
      default: 1000,
    },
    hostelFees: {
      type: Number,
      default: 60000,
    },
    transportFees: {
      type: Number,
      default: 18000,
    },
    eligibility: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    placement: [
      {
        type: String, // Top placement companies
      },
    ],
    subjects: [
      {
        type: String,
      },
    ],
    syllabusPdfUrl: {
      type: String,
      default: '',
    },
    brochureUrl: {
      type: String,
      default: '',
    },
    admissionStatus: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
