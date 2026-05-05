import mongoose from "mongoose";
import fs from "fs";

const updateSuperAdmin = async () => {
  try {
    const envFile = fs.readFileSync(".env", "utf8");
    const mongoUrl = envFile.split("\n").find(line => line.startsWith("MONGODB_URL")).split("=")[1].trim();
    await mongoose.connect(mongoUrl);
    const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    await User.updateOne({ email: "peerview.team@gmail.com" }, { $set: { isSuperAdmin: true } });
    console.log("Updated!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateSuperAdmin();
