import User from "@/models/userMode";
import dbConnect from "@/app/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendEmail } from "@/app/utils/sendEmail";
import { authenticator } from "otplib";

export const POST = async (req) => {
  try {
    const {
      userName,
      email,
      password,
      batch,
      section,
      skills,
      phoneNumber,
      linkedIn,
      portFolio,
    } = await req.json();

    await dbConnect();

    // if (!email.endsWith("@kiet.edu")) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "Email should be of KIET (@kiet.edu)",
    //   });
    // }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = authenticator.generate(email);
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const newUser = await User.create({
      userName,
      email,
      skills,
      phoneNumber,
      linkedIn,
      portFolio,
      batch,
      section,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    // Send OTP on email
    const mailResponse = await sendEmail(newUser.email, otp);
    if (!mailResponse) {
      await User.deleteOne({ _id: newUser._id });
      return NextResponse.json({
        success: false,
        message: "Failed to send OTP. User profile has been removed.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      newUser,
      mailResponse,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error,
    });
  }
};
