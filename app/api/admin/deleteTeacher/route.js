import dbConnect from "@/app/dbConfig/dbConfig";
import Teacher from "@/models/teacherModel";
import User from "@/models/userMode";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const DELETE = async (req) => {
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

    const url = new URL(req.url);
    const teacherId = url.searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json({
        success: false,
        message: "Target Teacher ID is required",
      });
    }

    const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);

    if (!deletedTeacher) {
      return NextResponse.json({
        success: false,
        message: "Target teacher not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Teacher deleted successfully by Admin",
    });
  } catch (error) {
    console.error("Error deleting teacher as admin:", error);
    return NextResponse.json({
      success: false,
      message: "Deletion failed",
    });
  }
};
