import mongoose from '../config/pg-mongoose.js';

const studyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: String, // Teacher's name
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);
export default StudyMaterial;
