import jwt from "jsonwebtoken";
import crypto from "crypto";

// ACCESS TOKEN (plain payload)
export const generateAccessToken = (payload, secret) => {
  return jwt.sign(payload, secret, { expiresIn: "1m" });
};

// REFRESH TOKEN
export const generateRefreshToken = ({ _id }, secret) => {
  return jwt.sign(
    { id: _id.toString() },
    secret,
    { expiresIn: "7d" }
  );
};

// VERIFY TOKENS
export const verifyAccessToken = (token, secret) => {
  return jwt.verify(token, secret);
};

export const VerifyRefreshToken = (token, secret) => {
  return jwt.verify(token, secret);
};

// EMAIL TOKEN
export const createToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
