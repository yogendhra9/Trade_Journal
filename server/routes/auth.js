import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import User from "../models/User.js";

const router = express.Router();
dotenv.config();

const {
  ANGEL_ONE_API_KEY,
  REDIRECT_URL,
  API_SECRET,
  FRONTEND_URL,
  CLIENT_CODE,
} = process.env;

console.log("ANGEL_ONE_API_KEY:", ANGEL_ONE_API_KEY);
console.log("REDIRECT_URL:", REDIRECT_URL);
console.log("FRONTEND_REDIRECT_URL:", FRONTEND_URL);
console.log("CLIENT_CODE:", CLIENT_CODE);

// 1. Redirect user to Angel One login
router.get("/angel-one", (req, res) => {
  const state = Math.random().toString(36).substring(7);
  console.log(state);
  req.session.oathstate = state;
  
  const url = `https://smartapi.angelbroking.com/publisher-login?api_key=${ANGEL_ONE_API_KEY}&redirect_uri=${REDIRECT_URL}&state=${state}`;
  res.redirect(url);
});

// 2. Handle callback from Angel One login
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;
  console.log("Oauth callback recieved:", { code, state });
  console.log("req.session:", req.session);
  console.log("req.session.oathstate:", req.session.oathstate);

  try {
    if (
      !req.session ||
      !req.session.oathstate ||
      state !== req.session.oathstate
    ) {
      console.error("Invalid state parameter or session missing");
      return res.status(400).send("Invalid state parameter or session missing");
    }
    const response = await axios.post(
      "https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword",
      {
        api_key: ANGEL_ONE_API_KEY,
        clientcode: CLIENT_CODE,
        password: API_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Source-API": "ANGEL_ONE_API",
          "X-UserType": "USER",
          "X-SourceID": "WEB",
          "X-ClientLocalIP": req.ip,
          "X-ClientPublicIP": req.ip,
          "X-MACAddress": "fe:80::1",
        },
      }
    );

    const token = response.data.jwToken;
    console.log(token + "this is jw token from the backend");

    const user = await User.findOneAndUpdate(
      {
        clientcode: CLIENT_CODE,
      },
      { token },
      { upsert: true, new: true }
    );

    // Redirect to frontend with the obtained token
    res.redirect(`${FRONTEND_URL}?auth_token=${token}`);
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send("Internal server error");
  }
});

// ✅ 3. New route to verify auth status
router.get("/verify", async (req, res) => {
  try {
    const clientcode = CLIENT_CODE;

    const user = await User.findOne({ clientcode });

    if (!user || !user.token) {
      return res
        .status(401)
        .json({ valid: false, message: "User not authenticated" });
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
