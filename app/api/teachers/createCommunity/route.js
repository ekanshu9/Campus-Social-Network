import dbConnect from "@/app/dbConfig/dbConfig";
import Community from "@/models/communities";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Teacher from "@/models/teacherModel";

export const POST = async (req) => {
  try {
    await dbConnect();
    const { name, about } = await req.json();
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
    const teacher = await Teacher.findById(teacherId).populate("");
    if (!teacher) {
      return NextResponse.json({
        success: false,
        message: "Teacher not found.",
      });
    }
    const newCommunity = await Community.create({
      name,
      about,
      owner: teacher._id,
      ownerName: teacher.name,
    });
    teacher.createdCommunity.push(newCommunity._id);
    await teacher.save();
    return NextResponse.json({
      success: true,
      message: "Community created successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
