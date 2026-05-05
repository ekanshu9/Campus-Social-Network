import dbConnect from "@/app/dbConfig/dbConfig";
import User from "@/models/userMode";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await dbConnect();

    const { userId, title, description, link } = await req.json();

    if (!title || !description) {
      return NextResponse.json({
        success: false,
        message: "Title or description cannot be empty",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const newProject = {
      title,
      description,
      link,
    };

    user.projects.push(newProject);

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Project added successfully",
      projects: user.projects,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};
