import dbConnect from "@/app/dbConfig/dbConfig";
import Teacher from "@/models/teacherModel";
import { NextResponse } from "next/server";
export const revalidate = 0;

export const GET = async () => {
  try {
    await dbConnect();
    const users = await Teacher.find({})
      .select("-password")
      .sort({
        name: { $eq: "Arun" }, // Prioritize "Arun"
        name: 1, // Then sort alphabetically
      });

    const response = NextResponse.json({
      success: true,
      users,
    });

    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error retrieving users.",
      },
      { status: 500 }
    );
  }
};
