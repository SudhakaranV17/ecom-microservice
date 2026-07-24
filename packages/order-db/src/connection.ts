import mongoose from "mongoose";
let isConnected = false;
export async function ConnectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please provide MONGODB_URI");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("Connected to database", process.env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to database", process.env.MONGODB_URI);
    throw new Error("Unable to connect to database", { cause: error });
  }
}
