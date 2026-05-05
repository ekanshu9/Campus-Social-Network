import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
});

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  skills: [
    {
      type: String,
      required: true,
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  profile: {
    type: String,
    default: "",
  },
  designation: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  isTeacher: {
    type: Boolean,
    default: true,
  },
  projects: [
    {
      type: projectSchema, // Correct way to include sub-schema
    },
  ],
  books: [
    {
      type: String,
    },
  ],
  patents: [
    {
      type: String,
    },
  ],
  createdCommunity: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

const Teacher =
  mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

export default Teacher;
