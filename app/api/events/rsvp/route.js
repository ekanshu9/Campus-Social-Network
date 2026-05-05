import dbConnect from "@/app/dbConfig/dbConfig";
import Event from "@/models/eventModel";
import User from "@/models/userMode";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const POST = async (req) => {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json({ success: false, message: "Event ID is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" });
    }

    const alreadyRsvp = event.rsvps.includes(userId);

    if (alreadyRsvp) {
      event.rsvps = event.rsvps.filter((id) => id.toString() !== userId);
      await event.save();
      return NextResponse.json({
        success: true,
        message: "RSVP cancelled",
        rsvpCount: event.rsvps.length,
        rsvped: false,
      });
    }

    event.rsvps.push(userId);
    await event.save();

    // Send email confirmation
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const eventDate = new Date(event.date).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `RSVP Confirmed: ${event.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #1a1a2e; color: #eaeaea;">
            <h2 style="color: #4fc3f7;">🎉 You're registered!</h2>
            <p>Hi <strong>${user.userName}</strong>,</p>
            <p>Your RSVP for <strong>"${event.title}"</strong> has been confirmed!</p>
            <div style="background: #16213e; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>📅 Date:</strong> ${eventDate}</p>
              <p><strong>⏰ Time:</strong> ${event.time}</p>
              <p><strong>📍 Venue:</strong> ${event.venue}</p>
              <p><strong>📋 Category:</strong> ${event.category}</p>
            </div>
            <p>See you there!</p>
            <p style="color: #888;">— PeerView Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the RSVP if email fails
    }

    return NextResponse.json({
      success: true,
      message: "RSVP confirmed! Check your email.",
      rsvpCount: event.rsvps.length,
      rsvped: true,
    });
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json({ success: false, message: "Failed to RSVP" });
  }
};
