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

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  skills: [
    {
      type: String,
      required: true,
    },
  ],
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  linkedIn: {
    type: String,
    required: true,
  },
  portFolio: {
    type: String,
    required: true,
  },
  certifications: [
    {
      type: String,
    },
  ],
  otpExpiry: {
    type: Date,
  },
  otp: {
    type: String,
  },
  isOtpVerified: {
    type: Boolean,
    default: false,
  },
  resume: {
    type: String,
  },
  profile: {
    type: String,
    default: "",
  },
  projects: [
    {
      type: projectSchema,
      default: [],
    },
  ],
  instaId: {
    type: String,
  },
  leetcode: {
    type: String,
  },
  hackerRank: {
    type: String,
  },
  placedCompanies: [{ type: String }],
  isAlumni: {
    type: Boolean,
    default: false,
  },
  graduationYear: {
    type: String,
  },
  currentCompany: {
    type: String,
  },
  currentRole: {
    type: String,
  },
  joinedCommunties: [],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
