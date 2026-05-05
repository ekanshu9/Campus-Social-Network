import dbConnect from "@/app/dbConfig/dbConfig";
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
      userId,
      userName,
      email,
      batch,
      section,
      phoneNumber,
      skills,
      portFolio,
      linkedIn,
      placedCompanies,
    } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Target User ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Target user not found",
      });
    }

    if (user.isSuperAdmin && !adminUser.isSuperAdmin) {
      return NextResponse.json({
        success: false,
        message: "Action denied. Sub-admins cannot update the Super Admin.",
      });
    }

    const updates = {};
    if (userName) updates.userName = userName;
    if (email) updates.email = email;
    if (batch) updates.batch = batch;
    if (section) updates.section = section;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (portFolio) updates.portFolio = portFolio;
    if (linkedIn) updates.linkedIn = linkedIn;

    if (placedCompanies) {
      updates.placedCompanies = placedCompanies; // Admin overrides completely
    }

    if (skills) {
      updates.skills = skills; // Admin overrides completely
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      message: "Student details updated successfully by Admin",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user as admin:", error);
    return NextResponse.json({
      success: false,
      message: "Updation failed",
    });
  }
};
