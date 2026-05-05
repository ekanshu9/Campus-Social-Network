import dbConnect from "@/app/dbConfig/dbConfig";
import Showcase from "@/models/showcaseModel";
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
    const userId = decoded.id;

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ success: false, message: "Project ID is required" });
    }

    const project = await Showcase.findById(projectId);
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" });
    }

    const alreadyUpvoted = project.upvotes.includes(userId);

    if (alreadyUpvoted) {
      project.upvotes = project.upvotes.filter((id) => id.toString() !== userId);
    } else {
      project.upvotes.push(userId);
    }

    await project.save();

    return NextResponse.json({
      success: true,
      message: alreadyUpvoted ? "Upvote removed" : "Upvoted!",
      upvoteCount: project.upvotes.length,
      upvoted: !alreadyUpvoted,
    });
  } catch (error) {
    console.error("Upvote error:", error);
    return NextResponse.json({ success: false, message: "Failed to upvote" });
  }
};
