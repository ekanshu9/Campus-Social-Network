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

    // Get all messages where this user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ createdAt: -1 });

    // Group by conversation partner
    const conversationMap = {};

    messages.forEach((msg) => {
      const partnerId =
        msg.sender.toString() === userId
          ? msg.receiver.toString()
          : msg.sender.toString();

      if (!conversationMap[partnerId]) {
        const isSender = msg.sender.toString() === userId;
        conversationMap[partnerId] = {
          partnerId,
          partnerName: isSender ? msg.receiverName : msg.senderName,
          partnerModel: isSender ? msg.receiverModel : msg.senderModel,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        };
      }

      // Count unread messages from partner
      if (msg.receiver.toString() === userId && !msg.read) {
        conversationMap[partnerId].unreadCount += 1;
      }
    });

    const conversations = Object.values(conversationMap);

    const response = NextResponse.json({
      success: true,
      conversations,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json({ success: false, message: "Failed to get conversations" });
  }
};
