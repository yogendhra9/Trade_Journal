import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import User from "../models/User.js";
import { SmartAPI } from "smartapi-javascript";
import * as OTPAuth from "otpauth";

const router = express.Router();
dotenv.config();

console.log("Inspecting OTPAuth module:", OTPAuth);

const {
  ANGEL_ONE_API_KEY,
  REDIRECT_URL,
  FRONTEND_URL,
  CLIENT_CODE,
  TOTP_SEED,
} = process.env;

console.log("Environment variables loaded in auth.js:");
console.log("ANGEL_ONE_API_KEY:", ANGEL_ONE_API_KEY);
console.log("REDIRECT_URL:", REDIRECT_URL); // Note: REDIRECT_URL is less critical with SDK, but kept for context
console.log("FRONTEND_URL:", FRONTEND_URL);
console.log("CLIENT_CODE:", CLIENT_CODE);
console.log("TOTP_SEED:", TOTP_SEED ? "Set" : "Not Set");

// New POST route for direct login using SDK
router.post("/login", async (req, res) => {
  const { clientcode, password } = req.body; // Assuming frontend sends clientcode and password (API_SECRET)

  if (!clientcode || !password) {
    return res
      .status(400)
      .json({ message: "Client code and password are required" });
  }

  try {
    // Initialize TOTP generator
    const totp = new OTPAuth.TOTP({
      issuer: "AngelOne",
      label: clientcode,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(TOTP_SEED),
    });

    // Generate current TOTP
    const token = totp.generate();
    console.log("Generated TOTP:", token); // For debugging, remove in production

    // Initialize SmartAPI SDK
    const smart_api = new SmartAPI({
      api_key: ANGEL_ONE_API_KEY,
    });

    // Generate session using Client Code, Password (API_SECRET), and TOTP
    const sessionResponse = await smart_api.generateSession(
      clientcode,
      password,
      token
    );
    console.log("Angel One generateSession response:", sessionResponse);

    if (
      sessionResponse &&
      sessionResponse.data &&
      sessionResponse.data.jwtToken
    ) {
      const jwtToken = sessionResponse.data.jwtToken;
      const refreshToken = sessionResponse.data.refreshToken || null;

      // Store user token in MongoDB
      const user = await User.findOneAndUpdate(
        { clientcode: clientcode },
        { token: jwtToken, refreshToken: refreshToken },
        { upsert: true, new: true }
      );

      // Send success response to frontend with token
      return res.status(200).json({
        message: "Login successful",
        token: jwtToken,
        user: { clientcode: user.clientcode },
      });
    } else {
      console.error(
        "Angel One generateSession failed or returned invalid data:",
        sessionResponse
      );
      return res.status(401).json({
        message: "Angel One authentication failed or invalid response",
      });
    }
  } catch (error) {
    console.error(
      "Error during Angel One login:",
      error.response ? error.response.data : error.message
    );
    // Handle specific Angel One API errors if needed
    res
      .status(500)
      .json({ message: "Internal server error during authentication" });
  }
});

// Existing /verify route (kept for token validation)
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ valid: false, message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];

    const user = await User.findOne({ token: token }); // Verify token against stored token

    if (!user || !user.token) {
      return res.status(401).json({
        valid: false,
        message: "User not authenticated or token invalid",
      });
    }

    // Optionally, you might want to call Angel One's getProfile or validate token using their API here
    // to ensure the token is still active and valid with Angel One.

    res.status(200).json({
      valid: true,
      user: { clientcode: user.clientcode },
      token: user.token,
    });
  } catch (error) {
    console.error("Auth verify error:", error);
    res.status(500).json({ valid: false, message: "Internal server error" });
  }
});

export default router;
