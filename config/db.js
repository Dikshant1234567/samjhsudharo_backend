import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    console.log("📦 Database Name:", conn.connection.name);
    return true;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log("💡 To fix this issue, you need to whitelist your IP address in MongoDB Atlas.");
    console.log("📌 Visit: https://www.mongodb.com/docs/atlas/security-whitelist/");
    // Don't exit the process, allow the application to run with limited functionality
    return false;
  }
};

export default connectDB;
