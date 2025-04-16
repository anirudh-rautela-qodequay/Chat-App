const jwt = require("jsonwebtoken");
import crypto from "crypto";
import bcrypt from "bcrypt";

export const create_token = async (_id: string) => {
  try {
    let token = await jwt.sign({ _id: _id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
  } catch (err) {
    return err;
  }
};

export const reset_token = async () => { return crypto.randomBytes(20).toString('hex') };

export const expiry_time = async () => { return new Date(Date.now() + 3600000).toISOString() };

export const hashed_password = async (password: string) => {
  return await bcrypt.hash(password, 10);
};