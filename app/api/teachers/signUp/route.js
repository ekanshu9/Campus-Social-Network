import dbConnect from "@/app/dbConfig/dbConfig";
import Teacher from "@/models/teacherModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req) => {
  try {
    const { name, email, password, phoneNumber, designation } =
      await req.json();
    await dbConnect();

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return NextResponse.json({
        success: false,
        message: "Teacher already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Teacher.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      designation,
    });
    return NextResponse.json({
      success: true,
      message: "Profile created successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error,
    });
  }
};
