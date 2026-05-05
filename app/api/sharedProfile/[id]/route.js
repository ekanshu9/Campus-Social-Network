import dbConnect from "@/app/dbConfig/dbConfig";
import User from "@/models/userMode";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    await dbConnect();
    const { id } = await params;
    const user = await User.findById(id).select("-password");
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
    return NextResponse.json({
      success: false,
      error,
    });
  }
};
