import mongoose from '../config/pg-mongoose.js';

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true, // e.g. "Computer Science", "Management", "Engineering"
    },
    qualification: {
      type: String, // e.g. "PhD in Computer Science", "M.Tech"
      required: true,
    },
    subjects: [
      {
        type: String, // Subjects assigned
      },
    ],
    salary: {
      type: Number,
      required: true,
    },
    salaryStatus: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Paid',
    },
    attendance: {
      type: Number, // Percentage of attendance
      default: 95,
    },
    leaveBalance: {
      type: Number,
      default: 12,
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
