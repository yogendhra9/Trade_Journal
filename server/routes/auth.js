import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import User from "../models/User.js";

const router = express.Router();
dotenv.config();

const { ANGEL_ONE_API_KEY, REDIRECT_URL, API_SECRET } = process.env;

console.log("ANGEL_ONE_API_KEY:", ANGEL_ONE_API_KEY);
console.log("REDIRECT_URL:", REDIRECT_URL);

// 1. Redirect user to Angel One login
router.get("/angel-one", (req, res) => {
  const url = `https://smartapi.angelbroking.com/publisher-login?api_key=${ANGEL_ONE_API_KEY}&redirect_uri=${REDIRECT_URL}`;
  res.redirect(url);
});

// 2. Handle callback from Angel One login
router.get("/callback", async (req, res) => {
  const { auth_code } = req.query;

  try {
    const response = await axios.post(
      "https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword",
      {
        api_key: ANGEL_ONE_API_KEY,
        clientcode: process.env.CLIENT_CODE,
        password: API_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Source-API": "ANGEL_ONE_API",
        },
      }
    );

    const token = response.data.jwToken;

    const user = await User.findOneAndUpdate(
      {
        clientcode: process.env.CLIENT_CODE,
      },
      { token },
      { upsert: true, new: true }
    );

    res.send("Login successful");
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send("Internal server error");
  }
});

// ✅ 3. New route to verify auth status
router.get("/verify", async (req, res) => {
  try {
    const clientcode = process.env.CLIENT_CODE;

    const user = await User.findOne({ clientcode });

    if (!user || !user.token) {
      return res.status(401).json({ valid: false, message: "User not authenticated" });
    }

    res.status(200).json({
      valid: true,
      user: { clientcode },
      token: user.token,
    });
  } catch (error) {
    console.error("Auth verify error:", error);
    res.status(500).json({ valid: false, message: "Internal server error" });
  }
});

export default router;
