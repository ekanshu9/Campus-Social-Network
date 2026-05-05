import dbConnect from "@/app/dbConfig/dbConfig";
import Showcase from "@/models/showcaseModel";
import { NextResponse } from "next/server";

export const revalidate = 0;

export const GET = async () => {
  try {
    await dbConnect();

    const projects = await Showcase.find({}).sort({ createdAt: -1 });

    const response = NextResponse.json({
      success: true,
      projects,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Get showcase error:", error);
    return NextResponse.json({ success: false, message: "Failed to get projects" });
  }
};
