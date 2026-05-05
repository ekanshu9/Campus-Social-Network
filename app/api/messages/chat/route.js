import dbConnect from "@/app/dbConfig/dbConfig";
import Message from "@/models/messageModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const revalidate = 0;

export const GET = async (req) => {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decoded.id;

    const url = new URL(req.url);
    const partnerId = url.searchParams.get("partnerId");

    if (!partnerId) {
      return NextResponse.json({ success: false, message: "Partner ID is required" });
    }

    // Get messages between these two users
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { sender: partnerId, receiver: userId, read: false },
      { read: true }
    );

    const response = NextResponse.json({
      success: true,
      messages,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Get chat error:", error);
    return NextResponse.json({ success: false, message: "Failed to get chat" });
  }
};
