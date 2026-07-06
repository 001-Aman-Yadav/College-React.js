import mongoose from '../config/pg-mongoose.js';

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    admissionNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows null/empty values before approval
    },
    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
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
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    category: {
      type: String, // General, OBC, SC, ST
      required: true,
    },
    religion: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      default: 'Indian',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    previousQualification: {
      type: String,
      required: true,
    },
    marks10th: {
      type: Number,
      required: true,
    },
    marks12th: {
      type: Number,
      required: true,
    },
    graduationMarks: {
      type: Number,
    },
    documents: {
      photo: { type: String, default: '' },
      signature: { type: String, default: '' },
      aadhar: { type: String, default: '' },
      marksheet: { type: String, default: '' },
      transferCertificate: { type: String, default: '' },
      migrationCertificate: { type: String, default: '' },
      incomeCertificate: { type: String, default: '' },
      casteCertificate: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Suspended', 'Passout'],
      default: 'Pending',
    },
    hostelAllocated: {
      type: Boolean,
      default: false,
    },
    hostelRoomNumber: {
      type: String,
      default: '',
    },
    transportAllocated: {
      type: Boolean,
      default: false,
    },
    transportRoute: {
      type: String,
      default: '',
    },
    attendance: {
      type: Number, // Percentage
      default: 85,
    },
    results: [
      {
        semester: Number,
        gpa: Number,
        remarks: String,
        subjects: [
          {
            subjectName: String,
            marksObtained: Number,
            maxMarks: Number,
            grade: String,
          },
        ],
      },
    ],
    leaves: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        reason: { type: String, required: true },
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
        remarks: { type: String, default: '' }
      }
    ],
    complaints: [
      {
        category: { type: String, required: true },
        subject: { type: String, required: true },
        content: { type: String, required: true },
        status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
        reply: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    libraryBooks: [
      {
        bookTitle: { type: String, required: true },
        author: { type: String, required: true },
        issueDate: { type: Date, default: Date.now },
        dueDate: { type: Date, required: true },
        status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' }
      }
    ],
    remarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
