import mongoose from '../config/pg-mongoose.js';

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['Admission', 'Semester', 'Hostel', 'Transport', 'Fine'],
      required: true,
    },
    method: {
      type: String,
      enum: ['UPI', 'Debit Card', 'Credit Card', 'Net Banking', 'Cash'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed'],
      default: 'Pending',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
