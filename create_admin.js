import mongoose from "mongoose";
import User from "./models/userMode.js";
import bcrypt from "bcrypt";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB.");

    const email = "peerview.team@gmail.com";
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("User already exists! Making them an admin...");
      existingAdmin.isAdmin = true;
      existingAdmin.isSuperAdmin = true;
      existingAdmin.isOtpVerified = true;
      await existingAdmin.save();
      console.log("Success! Account is now an admin.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const newAdmin = await User.create({
      userName: "Super Admin",
      email: email,
      password: hashedPassword,
      batch: "Admin",
      section: "Admin",
      phoneNumber: 9999999999,
      linkedIn: "N/A",
      portFolio: "N/A",
      skills: ["Administration"],
      isAdmin: true,
      isSuperAdmin: true,
      isVerified: true,
      isOtpVerified: true, // This allows you to skip OTP check on login
    });

    console.log(`Success! Admin account created.`);
    console.log(`Email: ${email}`);
    console.log(`Password: Admin@123`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
