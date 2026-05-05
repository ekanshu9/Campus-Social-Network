import dbConnect from "@/app/dbConfig/dbConfig";
import Teacher from "@/models/teacherModel";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await dbConnect();

    const { userId, imageUrl } = await req.json();

    const user = await Teacher.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User Not Found",
      });
    }

    user.profile = imageUrl;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Image Uploaded Successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
};
