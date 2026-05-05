import User from "@/models/userMode";
import dbConnect from "@/app/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendToken } from "@/app/utils/jwt";

export const POST = async (req) => {
  try {
    const { email, password } = await req.json();
    await dbConnect();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "It's required to fill both the details",
      });
    }

    const findUser = await User.findOne({ email });

    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: "Email or Password is incorrect",
      });
    }

    if (!findUser.isAdmin) {
      return NextResponse.json({
        success: false,
        message: "Access Denied. You are not an Admin.",
      });
    }

    const matchedPassword = await bcrypt.compare(password, findUser.password);
    if (!matchedPassword) {
      return NextResponse.json({
        success: false,
        message: "Email or Password is incorrect",
      });
    }

    // Skip OTP check for admins or check if they have it
    // Automatically verify admins or let them go to OTP
    if (!findUser.isOtpVerified) {
      findUser.isOtpVerified = true;
    }

    // Auto-grant Super Admin status to the primary team email
    if (findUser.email === "peerview.team@gmail.com") {
      findUser.isSuperAdmin = true;
    }

    await findUser.save();

    return sendToken(findUser, "Admin logged in Successfully", "admin");
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred during login. Please try again.",
    });
  }
};
