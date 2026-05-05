import mongoose from "mongoose";
import User from "./models/userMode.js";


const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB.");

    const user = await User.findOneAndUpdate(
      { email },
      { isAdmin: true },
      { new: true }
    );

    if (user) {
      console.log(`Success! User ${email} is now an Admin.`);
    } else {
      console.log(`User with email ${email} not found.`);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

const targetEmail = process.argv[2];
if (!targetEmail) {
  console.log("Please provide an email address. Example: node make_admin.js student@example.com");
  process.exit(1);
}

makeAdmin(targetEmail);
