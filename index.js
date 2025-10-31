import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import individualUserRoutes from "./routes/individualUserRoutes.js";
import groupUserRoutes from "./routes/groupUserRoutes.js";

dotenv.config();
const app = express();

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/individual", individualUserRoutes);
app.use("/api/group", groupUserRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
