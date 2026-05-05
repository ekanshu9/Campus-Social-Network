import dbConnect from "@/app/dbConfig/dbConfig";
import { sendToken } from "@/app/utils/jwt";
import Teacher from "@/models/teacherModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

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

    // Find user by email
    const findUser = await Teacher.findOne({ email });
    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: "Email or Password is incorrect",
      });
    }

    // Compare passwords
    const matchedPassword = await bcrypt.compare(password, findUser.password);
    if (!matchedPassword) {
      return NextResponse.json({
        success: false,
        message: "Email or Password is incorrect",
      });
    }

    return sendToken(findUser, "User logged in Successfully", "teacher");
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
};
