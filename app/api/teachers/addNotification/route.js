import dbConnect from "@/app/dbConfig/dbConfig";
import Notification from "@/models/notificationModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Teacher from "@/models/teacherModel";

export const POST = async (req) => {
  try {
    await dbConnect();
    const { title, content, url } = await req.json();

    if (!title || !content) {
      return NextResponse.json({
        success: false,
        message: "Title and Content are required",
      });
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized access.",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, message: "Invalid token." });
    }

    const teacherId = decoded.id;
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return NextResponse.json({
        success: false,
        message: "Teacher not found.",
      });
    }

    // Create a new notification
    const newNotification = await Notification.create({
      title,
      content,
      url,
      teacher: teacher._id,
    });

    return NextResponse.json({
      success: true,
      message: "Notification created successfully.",
      data: newNotification,
      author: teacher.name,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
