import { User } from "../model/userModel.js";
import Role from "../model/roleModel.js";
import { generateHashPassword, VerifyPasswordHash } from "../utils/passwordValidation.js";
import { userValidate } from "../utils/userValidate.js";
import { createToken, generateAccessToken, generateRefreshToken, VerifyRefreshToken } from "../utils/token.js";
import { emailSend } from "../services/emailService.js";
import { createOtp } from "../utils/otp.js";

//! Register
export const registerUser = async (req, res) => {
  try {
    userValidate(req.body);
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already Exists" });

    const hashpassword = await generateHashPassword(password);
    const token = createToken();

    await User.create({
      name,
      email,
      password: hashpassword,
      verificationToken: token,
      verificationTokenExpires: Date.now() + 10 * 60 * 1000
    });

    const link = `http://localhost:3000/api/auth/verifyEmail/${token}`;

    await emailSend(
      email,
      "Verify your email",
      `<p>Click to verify :</p> <a href="${link}">${link}</a>`
    );

    res.status(201).json({
      message: "Register completed successfully. Please verify your email."
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went Wrong",
      error: error.message
    });
  }
};

//! Verify Email
export const verifiyEmail = async (req, res) => {
  const token = req.params.token;
  const user = await User.findOne({ verificationToken: token });

  if (!user) return res.status(400).json({ message: "Invalid Token" });
  if (user.verificationTokenExpires < Date.now())
    return res.status(400).json({ message: "Token Expired" });

  user.emailVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpires = null;

  const otp = createOtp();
  user.otp = otp;
  user.otpExpires = Date.now() + 2 * 60 * 1000; // ✅ fixed

  await user.save();

  await emailSend(
    user.email,
    "OTP verification",
    `<h3>Your OTP: ${otp}</h3>`
  );

  res.json({
    message: "Email verified. OTP sent to email"
  });
};

//! Verify OTP
export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const user = await User.findOne({ otp });

  if (!user) return res.status(400).json({ message: "Invalid OTP" });
  if (user.otpExpires < Date.now())
    return res.status(400).json({ message: "OTP Expired" });

  user.otp = null;
  user.otpExpires = null;
  user.twoFactor = true;

  await user.save();

  res.json({
    message: "OTP Verified, you can now login"
  });
};

//! LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await VerifyPasswordHash(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.twoFactor)
      return res.status(400).json({ message: "OTP not verified" });

    // ✅ Role assignment
    if (!user.role) {
      const roleDoc = await Role.findOne({ role: "user" });
      user.role = roleDoc._id;
      await user.save();
    }

    const accessToken = generateAccessToken(
      { id: user._id },
      process.env.JWT_SECRET_ACCESS_KEY
    );

    const refreshToken = generateRefreshToken(
      { _id: user._id },
      process.env.JWT_SECRET_REFRESH_KEY
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "Production"
    });

    res.json({
      message: "Login Successful",
      accessToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//! Refresh Token
export const GetNewAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token missing" });

  try {
    const payload = VerifyRefreshToken(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_KEY
    );

    const newAccessToken = generateAccessToken(
      { id: payload.id },
      process.env.JWT_SECRET_ACCESS_KEY
    );

    res.json({
      message: "New access token generated",
      accessToken: newAccessToken
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
