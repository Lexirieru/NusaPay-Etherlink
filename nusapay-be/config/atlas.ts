import env from "dotenv";
env.config();

import mongoose from "mongoose";

mongoose.set("strictQuery", false);

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`Database Connected : ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
  }
}
