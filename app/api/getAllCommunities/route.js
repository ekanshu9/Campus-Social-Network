import dbConnect from "@/app/dbConfig/dbConfig";
import Community from "@/models/communities";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    dbConnect();

    const community = await Community.find();

    return NextResponse.json({
      success: true,
      message: "All Communities Fetched Successfully",
      data: community,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
