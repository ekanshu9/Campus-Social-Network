import dbConnect from "@/app/dbConfig/dbConfig";
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
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Target User ID is required",
      });
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return NextResponse.json({
        success: false,
        message: "Target user not found",
      });
    }

    if (targetUser.isSuperAdmin && !adminUser.isSuperAdmin) {
      return NextResponse.json({
        success: false,
        message: "Action denied. Sub-admins cannot delete the Super Admin.",
      });
    }

    // Optional: Even Super Admin shouldn't delete themselves easily here, but we will just prevent sub admins for now.
    
    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully by Admin",
    });
  } catch (error) {
    console.error("Error deleting user as admin:", error);
    return NextResponse.json({
      success: false,
      message: "Deletion failed",
    });
  }
};
