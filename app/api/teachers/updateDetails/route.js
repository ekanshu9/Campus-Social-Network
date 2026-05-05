import dbConnect from "@/app/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Teacher from "@/models/teacherModel";

export const PATCH = async (req) => {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "No authentication token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decoded.id;

    const user = await Teacher.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const { phoneNumber, skills, about } = await req.json();

    const updates = {};
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (about) updates.about = about;

    if (skills) {
      const newSkills = skills.map((skill) => skill.trim());
      updates.skills = [...new Set([...user.skills, ...newSkills])];
    }

    const updatedUser = await Teacher.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Details Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating details:", error);
    return NextResponse.json({
      success: false,
      message: "Updation failed",
    });
  }
};
