import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.js";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Debug logs to check environment variables
console.log("Environment variables loaded:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("ANGEL_ONE_API_KEY:", process.env.ANGEL_ONE_API_KEY);
console.log("REDIRECT_URL:", process.env.REDIRECT_URL);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with updated options
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
// Routes
app.use("/auth", authRoutes);
//Server
const Port = process.env.PORT || 5000;
app.listen(Port, () => {
  console.log(`Server running on the port ${Port}`);
});
