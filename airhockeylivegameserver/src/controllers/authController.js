import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OTPSender } from "../Services/OTPSender.js";
import {
  createUser,
  findUserByUsername,
  setPasswordResetOtpByUsername,
  updateNewPasswordByUserName,
} from "../models/userModel.js";

export const register = async (req, res) => {
  try {
    console.log(`In Register Controller`);
    const { username, password } = req.body;

    const existing = await findUserByUsername(username);
    if (existing)
      return res
        .status(400)
        .json({ message: "User already exists", success: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const OTP = Math.floor(100000 + Math.random() * 900000);
    await OTPSender(
      username,
      "OTP Verification for Register",
      `Use this 6 digit OTP to complete your registration in NEON PONG Game: ${OTP}`
    );
    const user = await createUser(username, hashedPassword, OTP);

    res.status(200).json({ message: "User saved", user, success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error", error: err.message, success: false });
  }
};

export const verifyRegisterOTP = async (req, res) => {
  try {
    console.log(`In verifyRegisterOTP Controller`);
    const { username, otp } = req.body;
    console.log(`User: ${username}, otp: ${otp}`);

    const existing = await findUserByUsername(username);
    console.log(`fetchedUser: ${JSON.stringify(existing, null, 2)}`);
    if (!existing)
      return res
        .status(401)
        .json({ message: "Anauthorized request", success: false });

    let doesOTPMatch = existing.register_otp == otp ? true : false;
    if (doesOTPMatch) {
      res
        .status(200)
        .json({ message: "User Registered Successfully", success: true });
    }
    res.status(400).json({ message: "Wrong OTP", success: false });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error", error: err.message, success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);

    if (!user)
      return res
        .status(400)
        .json({ message: "User not found", success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const forgotPaasword = async (req, res) => {
  try {
    console.log(`In forgotPaasword Controller`);
    const { username } = req.body;

    const existing = await findUserByUsername(username);
    if (!existing)
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });

    const OTP = Math.floor(100000 + Math.random() * 900000);
    await OTPSender(
      username,
      "OTP Verification for resetting password",
      `Use this 6 digit OTP to complete your password reset in NEON PONG Game: ${OTP}`
    );
    await setPasswordResetOtpByUsername(username, OTP);

    res.status(200).json({ message: "OTP sent successfully", success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error", error: err.message, success: false });
  }
};

export const verifyForgotPasswordOTP = async (req, res) => {
  try {
    console.log(`In verifyRegisterOTP Controller`);
    const { username, otp } = req.body;
    console.log(`User: ${username}, otp: ${otp}`);

    const existing = await findUserByUsername(username);
    console.log(`fetchedUser: ${JSON.stringify(existing, null, 2)}`);
    if (!existing)
      return res
        .status(401)
        .json({ message: "Anauthorized request", success: false });

    let doesOTPMatch = existing.forgot_password_otp == otp ? true : false;
    if (doesOTPMatch) {
      res.status(200).json({ message: "OTP matches", success: true });
    }
    res.status(400).json({ message: "Wrong OTP", success: false });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error", error: err.message, success: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    console.log(`In resetPassword Controller`);
    const { username, password } = req.body;
    console.log(`User: ${username}, otp: ${password}`);

    const existing = await findUserByUsername(username);
    console.log(`fetchedUser: ${JSON.stringify(existing, null, 2)}`);
    if (!existing)
      return res
        .status(401)
        .json({ message: "Anauthorized request", success: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    await updateNewPasswordByUserName(username, hashedPassword);
    res
      .status(200)
      .json({ message: "Password Updated Successfully", success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error", error: err.message, success: false });
  }
};
