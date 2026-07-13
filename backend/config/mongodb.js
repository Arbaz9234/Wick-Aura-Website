import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/wick-aura`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
