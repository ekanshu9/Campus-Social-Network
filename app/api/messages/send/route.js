import dbConnect from "@/app/dbConfig/dbConfig";
import Message from "@/models/messageModel";
import User from "@/models/userMode";
import Teacher from "@/models/teacherModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const senderId = decoded.id;

    let senderName = "";
    let senderModel = "User";

    if (role === "teacher") {
      const teacher = await Teacher.findById(senderId);
      if (!teacher) return NextResponse.json({ success: false, message: "Sender not found" });
      senderName = teacher.name;
      senderModel = "Teacher";
    } else {
      const user = await User.findById(senderId);
      if (!user) return NextResponse.json({ success: false, message: "Sender not found" });
      senderName = user.userName;
      senderModel = "User";
    }

    const { receiverId, receiverModel, receiverName, message } = await req.json();

    if (!receiverId || !receiverModel || !message || !receiverName) {
      return NextResponse.json({ success: false, message: "All fields are required" });
    }

    const newMessage = await Message.create({
      sender: senderId,
      senderModel,
      senderName,
      receiver: receiverId,
      receiverModel,
      receiverName,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent",
      data: newMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ success: false, message: "Failed to send message" });
  }
};
