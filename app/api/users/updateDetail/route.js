import dbConnect from "@/app/dbConfig/dbConfig";
import User from "@/models/userMode";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const PATCH = async (req) => {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "No authentication token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const {
      phoneNumber,
      skills,
      portfolio,
      instaId,
      leetcode,
      hackerRank,
      placedCompanies,
    } = await req.json();

    const updates = {};
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (portfolio) updates.portFolio = portfolio;
    if (instaId) updates.instaId = instaId;
    if (leetcode) updates.leetcode = leetcode;
    if (hackerRank) updates.hackerRank = hackerRank;

    if (placedCompanies) {
      const newCompanies = placedCompanies.map((skill) => skill.trim());
      updates.placedCompanies = [
        ...new Set([...user.placedCompanies, ...newCompanies]),
      ];
    }

    if (skills) {
      const newSkills = skills.map((skill) => skill.trim());
      updates.skills = [...new Set([...user.skills, ...newSkills])];
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Details Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating details:", error);
    return NextResponse.json({
      success: false,
      message: "Updation failed",
    });
  }
};
