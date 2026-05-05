import dbConnect from "@/app/dbConfig/dbConfig";
import User from "@/models/userMode";
import Teacher from "@/models/teacherModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendToken } from "@/app/utils/jwt";

export const POST = async (req) => {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const adminUser = await User.findById(decoded.id);

    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ success: false, message: "Admin access required" });
    }

    const { targetUserId, role } = await req.json();

    if (!targetUserId || !role) {
      return NextResponse.json({ success: false, message: "Target user ID and role are required" });
    }

    let targetUser;
    if (role === "teacher") {
      targetUser = await Teacher.findById(targetUserId);
    } else {
      targetUser = await User.findById(targetUserId);
    }

    if (!targetUser) {
      return NextResponse.json({ success: false, message: "Target user not found" });
    }

    if (role !== "teacher" && targetUser.isSuperAdmin && !adminUser.isSuperAdmin) {
      return NextResponse.json({ success: false, message: "Sub-admins cannot impersonate the Super Admin." });
    }

    // Use sendToken to generate standard response and cookies for the target user
    const response = sendToken(targetUser, `Impersonating ${targetUser.name || targetUser.userName}`, role);

    // Save the original admin token in adminToken cookie
    response.cookies.set("adminToken", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return response;
  } catch (error) {
    console.error("Impersonation Error:", error);
    return NextResponse.json({ success: false, message: "Impersonation failed" });
  }
};
