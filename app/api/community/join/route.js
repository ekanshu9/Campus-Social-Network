import dbConnect from "@/app/dbConfig/dbConfig";
import Community from "@/models/communities";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userMode";

export const POST = async (req) => {
  try {
    await dbConnect();
    const { communityId } = await req.json();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const community = await Community.findById(communityId);
    if (!community) {
      return NextResponse.json({ success: false, message: "Community not found" });
    }

    const alreadyJoined = community.students.includes(user._id);

    if (alreadyJoined) {
      // Leave community
      community.students = community.students.filter(
        (id) => id.toString() !== user._id.toString()
      );
      await community.save();
      return NextResponse.json({
        success: true,
        message: "Left the community",
        joined: false,
      });
    } else {
      // Join community
      community.students.push(user._id);
      await community.save();
      return NextResponse.json({
        success: true,
        message: "Joined the community!",
        joined: true,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
