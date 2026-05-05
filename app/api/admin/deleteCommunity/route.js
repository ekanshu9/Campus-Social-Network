import dbConnect from "@/app/dbConfig/dbConfig";
import Community from "@/models/communities";
import User from "@/models/userMode";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const DELETE = async (req) => {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const adminUser = await User.findById(decoded.id);

    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ success: false, message: "Admin access required" });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Community ID is required" });
    }

    await Community.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Community deleted by Admin",
    });
  } catch (error) {
    console.error("Delete Community Error:", error);
    return NextResponse.json({ success: false, message: "Deletion failed" });
  }
};
