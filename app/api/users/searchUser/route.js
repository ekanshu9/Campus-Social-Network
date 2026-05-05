import User from "@/models/userMode";
import dbConnect from "@/app/dbConfig/dbConfig";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.trim() === "") {
    return NextResponse.json({
      success: false,
      message: "Search query can't be Empty",
    });
  }

  try {
    const users = await User.find({
      $or: [
        { userName: { $regex: query, $options: "i" } },
        { skills: { $regex: query, $options: "i" } },
      ],
    });
    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
};
