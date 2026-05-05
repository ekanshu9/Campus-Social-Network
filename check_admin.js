import mongoose from "mongoose";
import fs from "fs";

const checkSuperAdmin = async () => {
  try {
    const envFile = fs.readFileSync(".env", "utf8");
    const mongoUrl = envFile.split("\n").find(line => line.startsWith("MONGODB_URL")).split("=")[1].trim();
    await mongoose.connect(mongoUrl);
    const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    const admin = await User.findOne({ email: "peerview.team@gmail.com" });
    console.log("Admin Data:");
    console.log(admin);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkSuperAdmin();
