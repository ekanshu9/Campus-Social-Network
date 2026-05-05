import User from "@/models/userMode";
import dbConnect from "@/app/dbConfig/dbConfig";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const batch = searchParams.get("batch");
    const section = searchParams.get("section");

    const query = {};
    if (batch) query.batch = batch;
    if (section) query.section = section;
    const users = await User.find(query).select("-password");
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
