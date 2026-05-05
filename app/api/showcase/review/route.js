import dbConnect from "@/app/dbConfig/dbConfig";
import Showcase from "@/models/showcaseModel";
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
    const reviewerId = decoded.id;

    let reviewerName = "";
    let reviewerModel = "User";

    if (role === "teacher") {
      const teacher = await Teacher.findById(reviewerId);
      if (!teacher) return NextResponse.json({ success: false, message: "Reviewer not found" });
      reviewerName = teacher.name;
      reviewerModel = "Teacher";
    } else {
      const user = await User.findById(reviewerId);
      if (!user) return NextResponse.json({ success: false, message: "Reviewer not found" });
      reviewerName = user.userName;
      reviewerModel = "User";
    }

    const { projectId, comment } = await req.json();

    if (!projectId || !comment) {
      return NextResponse.json({ success: false, message: "Project ID and comment are required" });
    }

    const project = await Showcase.findById(projectId);
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" });
    }

    project.reviews.push({
      reviewer: reviewerId,
      reviewerModel,
      reviewerName,
      comment,
    });

    await project.save();

    return NextResponse.json({
      success: true,
      message: "Review added!",
      reviews: project.reviews,
    });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json({ success: false, message: "Failed to add review" });
  }
};
