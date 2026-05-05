import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/app/dbConfig/dbConfig";
import User from "@/models/userMode";

export const POST = async (req) => {
  try {
    await dbConnect();
    const adminToken = req.cookies.get("adminToken")?.value;

    if (!adminToken) {
      return NextResponse.json({ success: false, message: "No active impersonation session found." });
    }

    // Verify the admin token is still valid
    const decoded = jwt.verify(adminToken, process.env.JWT_TOKEN);
    const adminUser = await User.findById(decoded.id);

    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ success: false, message: "Invalid admin session." });
    }

    const response = NextResponse.json({
      success: true,
      message: "Returned to Admin session successfully.",
    });

    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    // Restore the admin token and role
    response.cookies.set("token", adminToken, options);
    response.cookies.set("role", "admin", options); // Admins usually use role "admin" but check how it's handled

    // Clear the adminToken cookie
    response.cookies.set("adminToken", "", { ...options, expires: new Date(0) });

    return response;
  } catch (error) {
    console.error("Revert Impersonation Error:", error);
    return NextResponse.json({ success: false, message: "Failed to revert impersonation." });
  }
};
