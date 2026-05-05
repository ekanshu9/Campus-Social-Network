import User from "@/models/userMode";
import dbConnect from "@/app/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req) => {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "JWT token must be provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findById(decoded.id).select("-password");

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
      message: "Error retrieving user data",
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};
