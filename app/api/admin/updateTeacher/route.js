import dbConnect from "@/app/dbConfig/dbConfig";
import Teacher from "@/models/teacherModel";
import User from "@/models/userMode";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
    const adminId = decoded.id;

    // Verify Admin Status
    const adminUser = await User.findById(adminId);
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    const {
      teacherId,
      name,
      email,
      designation,
      phoneNumber,
      skills,
      about,
      linkedIn,
    } = await req.json();

    if (!teacherId) {
      return NextResponse.json({
        success: false,
        message: "Target Teacher ID is required",
      });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return NextResponse.json({
        success: false,
        message: "Target teacher not found",
      });
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (designation) updates.designation = designation;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (about) updates.about = about;
    if (linkedIn) updates.linkedIn = linkedIn;

    if (skills) {
      updates.skills = skills; // Admin overrides completely
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      message: "Teacher details updated successfully by Admin",
      updatedTeacher,
    });
  } catch (error) {
    console.error("Error updating teacher as admin:", error);
    return NextResponse.json({
      success: false,
      message: "Updation failed",
    });
  }
};
