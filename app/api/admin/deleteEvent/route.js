import dbConnect from "@/app/dbConfig/dbConfig";
import Event from "@/models/eventModel";
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
      return NextResponse.json({ success: false, message: "Event ID is required" });
    }

    await Event.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Event deleted by Admin",
    });
  } catch (error) {
    console.error("Delete Event Error:", error);
    return NextResponse.json({ success: false, message: "Deletion failed" });
  }
};
