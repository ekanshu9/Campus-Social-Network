import User from "@/models/userMode";
import dbConnect from "@/app/dbConfig/dbConfig";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { email, otp } = await req.json();
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User Not Found",
      });
    }
    if (user.otp != otp) {
      return NextResponse.json({
        success: false,
        message: "Invalid OTP",
      });
    }
    if (Date.now() > user.otpExpiry) {
      return NextResponse.json({
        success: false,
        message: "OTP has expired",
      });
    }
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isOtpVerified = true;

    await user.save();
    return NextResponse.json({
      success: true,
      message: "OTP verifies Successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
};
