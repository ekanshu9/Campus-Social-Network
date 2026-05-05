import dbConnect from "@/app/dbConfig/dbConfig";
import Community from "@/models/communities";
import Notification from "@/models/notificationModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Teacher from "@/models/teacherModel";

export const POST = async (req, { params }) => {
  try {
    await dbConnect();
    const { title, description, link } = await req.json();

    const { id } = await params;

    if (!title || !description) {
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

    const community = await Community.findById(id);
    if (!community) {
      return NextResponse.json({
        success: false,
        message: "Community not found.",
      });
    }

    const newContent = { title, description, link };
    community.content.push(newContent);
    await community.save();

    // Create notification for all joined students
    if (community.students?.length > 0) {
      await Notification.create({
        title: `New post in ${community.name}`,
        content: `${teacher.name} posted: "${title}"`,
        url: link || "",
        teacher: teacher._id,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Content posted & members notified!",
      data: community,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
