import dbConnect from "@/app/dbConfig/dbConfig";
import Showcase from "@/models/showcaseModel";
import User from "@/models/userMode";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const { title, description, githubLink, liveLink, screenshots } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ success: false, message: "Title and description are required" });
    }

    const project = await Showcase.create({
      title,
      description,
      githubLink: githubLink || "",
      liveLink: liveLink || "",
      screenshots: screenshots || [],
      author: user._id,
      authorName: user.userName,
      authorProfile: user.profile || "",
    });

    return NextResponse.json({
      success: true,
      message: "Project showcased successfully!",
      project,
    });
  } catch (error) {
    console.error("Create showcase error:", error);
    return NextResponse.json({ success: false, message: "Failed to create showcase" });
  }
};
