import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.js";
import session from "express-session";
import MongoStore from "connect-mongo";
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

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-super-secret-key",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? "trade-journal-tbev.onrender.com"
          : "localhost",
    },
    proxy: true, // Add this line for deployment behind a proxy like Render
  })
);

// Middleware
app.use(
  cors({
    origin: [
      "https://trade-journal-yogendhra009-9633s-projects.vercel.app/",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
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
