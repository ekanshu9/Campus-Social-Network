import dbConnect from "@/app/dbConfig/dbConfig";
import Teacher from "@/models/teacherModel";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  try {
    await dbConnect();
    const { id } = await params;
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "ID is required",
      });
    }

    const user = await Teacher.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
};
