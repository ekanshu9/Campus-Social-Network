import dbConnect from "@/app/dbConfig/dbConfig";
import Event from "@/models/eventModel";
import User from "@/models/userMode";
import Teacher from "@/models/teacherModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const organizerId = decoded.id;

    let organizerName = "";
    let organizerModel = "User";

    if (role === "teacher") {
      const teacher = await Teacher.findById(organizerId);
      if (!teacher) return NextResponse.json({ success: false, message: "Organizer not found" });
      organizerName = teacher.name;
      organizerModel = "Teacher";
    } else {
      const user = await User.findById(organizerId);
      if (!user) return NextResponse.json({ success: false, message: "Organizer not found" });
      // Only admins can create events if they are students
      if (!user.isAdmin) {
        return NextResponse.json({ success: false, message: "Only Teachers or Admins can create events" });
      }
      organizerName = user.userName;
      organizerModel = "User";
    }

    const { title, description, date, time, venue, category } = await req.json();

    if (!title || !description || !date || !time || !venue) {
      return NextResponse.json({ success: false, message: "All fields are required" });
    }

    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      time,
      venue,
      category: category || "other",
      organizer: organizerId,
      organizerModel,
      organizerName,
    });

    return NextResponse.json({
      success: true,
      message: "Event created successfully!",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ success: false, message: "Failed to create event" });
  }
};
