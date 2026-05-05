import dbConnect from "@/app/dbConfig/dbConfig";
import Event from "@/models/eventModel";
import { NextResponse } from "next/server";

export const revalidate = 0;

export const GET = async () => {
  try {
    await dbConnect();

    const events = await Event.find({}).sort({ date: 1 });

    const response = NextResponse.json({
      success: true,
      events,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Get events error:", error);
    return NextResponse.json({ success: false, message: "Failed to get events" });
  }
};
