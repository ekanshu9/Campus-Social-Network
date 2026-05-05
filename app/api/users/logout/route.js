import { NextResponse } from "next/server";

export const POST = async (req) => {
  const response = NextResponse.json({
    success: true,
    message: "Logout Successfully",
  });
  response.cookies.set("token", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  response.cookies.set("role", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
};
