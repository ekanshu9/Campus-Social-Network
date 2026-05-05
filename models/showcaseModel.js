import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "reviews.reviewerModel",
  },
  reviewerModel: {
    type: String,
    required: true,
    enum: ["User", "Teacher"],
  },
  reviewerName: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const showcaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  githubLink: {
    type: String,
  },
  liveLink: {
    type: String,
  },
  screenshots: [
    {
      type: String,
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorProfile: {
    type: String,
    default: "",
  },
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  reviews: [reviewSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Showcase =
  mongoose.models.Showcase || mongoose.model("Showcase", showcaseSchema);

export default Showcase;
