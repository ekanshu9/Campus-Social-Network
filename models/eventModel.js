import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "organizerModel",
  },
  organizerModel: {
    type: String,
    required: true,
    enum: ["User", "Teacher"],
  },
  organizerName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["hackathon", "workshop", "seminar", "cultural", "sports", "other"],
    default: "other",
  },
  rsvps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
