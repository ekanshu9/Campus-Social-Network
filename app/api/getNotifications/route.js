import dbConnect from "@/app/dbConfig/dbConfig";
import Notification from "@/models/notificationModel";
import { NextResponse } from "next/server";

export const revalidate = 0;

export const GET = async () => {
  try {
    dbConnect();
    const notifications = await Notification.find().populate("teacher", "name");

    const response = NextResponse.json({
      success: true,
      notifications,
    });

    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
