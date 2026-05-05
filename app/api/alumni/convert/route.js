import dbConnect from "@/app/dbConfig/dbConfig";
import User from "@/models/userMode";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const adminId = decoded.id;

    const adminUser = await User.findById(adminId);
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized. Admin access required." });
    }

    const { userId, graduationYear, currentCompany, currentRole } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    user.isAlumni = true;
    user.graduationYear = graduationYear || "";
    user.currentCompany = currentCompany || "";
    user.currentRole = currentRole || "";
    await user.save();

    return NextResponse.json({
      success: true,
      message: `${user.userName} has been converted to Alumni!`,
    });
  } catch (error) {
    console.error("Convert alumni error:", error);
    return NextResponse.json({ success: false, message: "Failed to convert to alumni" });
  }
};
