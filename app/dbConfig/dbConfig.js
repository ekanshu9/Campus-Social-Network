import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      connectTimeoutMS: 20000,
    });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

export default dbConnect;
