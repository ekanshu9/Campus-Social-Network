import User from "@/models/userMode";
import dbConnect from "@/app/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const requester = await User.findById(decoded.id);

    if (!requester || !requester.isSuperAdmin) {
      return NextResponse.json({ success: false, message: "Only the Super Admin can create sub-admins." });
    }

    const { userName, email, password } = await req.json();

    if (!userName || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" });
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      return NextResponse.json({ success: false, message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      userName,
      email,
      password: hashedPassword,
      batch: "Admin",
      section: "Admin",
      phoneNumber: Math.floor(1000000000 + Math.random() * 9000000000), // Random placeholder
      linkedIn: "N/A",
      portFolio: "N/A",
      skills: ["Administration"],
      isAdmin: true,
      isSuperAdmin: false,
      isVerified: true,
      isOtpVerified: true,
    });

    return NextResponse.json({ success: true, message: "Sub Admin created successfully", admin: newAdmin });
  } catch (error) {
    console.error("Create Sub Admin Error:", error);
    return NextResponse.json({ success: false, message: `Failed to create Sub Admin: ${error.message}` });
  }
};
