import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const sendToken = (user, message, role) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
    expiresIn: "1d",
  });
  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };
  const response = NextResponse.json({
    success: true,
    message,
    user,
    token,
    otp: true,
  });
  response.cookies.set("token", token, options);
  response.cookies.set("role", role, options);

  return response;
};
