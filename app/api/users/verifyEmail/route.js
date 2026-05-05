import User from "@/models/userMode";
import dbConnect from "@/app/dbConfig/dbConfig";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    dbConnect();
    const reqBody = await req.json();
    const { verifyToken } = reqBody;
    console.log(verifyToken);
    const user = await User.findOne({
      verifyToken: verifyToken,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    user.isVerified = true;
    user.verifyTokenExpiry = undefined;
    user.verifyToken = undefined;
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Email Verified",
    });
  } catch (error) {
    NextResponse.json({
      success: false,
      error,
    });
  }
};
