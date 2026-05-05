import dbConnect from "@/app/dbConfig/dbConfig";
import User from "@/models/userMode";
import { NextResponse } from "next/server";

export const revalidate = 0;

export const GET = async () => {
  try {
    await dbConnect();

    const alumni = await User.find({ isAlumni: true, isAdmin: { $ne: true } })
      .select("-password -otp -otpExpiry")
      .sort({ graduationYear: -1 });

    const response = NextResponse.json({
      success: true,
      alumni,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Get alumni error:", error);
    return NextResponse.json({ success: false, message: "Failed to get alumni" });
  }
};
