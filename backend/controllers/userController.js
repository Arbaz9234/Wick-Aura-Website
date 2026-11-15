import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP, hashOTP, verifyOTP } from "../utils/otp.js";
import { sendEmail, otpEmailHTML } from "../utils/email.js";

// Generating user token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message:
          "User not found. Please check your email address or create a new account.",
      });
    }

    if (!user.isEmailVerified) {
      return res.json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        success: false,
        message:
          "Incorrect email or password. Please check your credentials and try again.",
      });
    }

    if (user.twoFactorEnabled) {
      const otp = generateOTP();
      user.otp = await hashOTP(otp);
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendEmail({
        to: email,
        subject: "Wick & Aura — Login Verification",
        html: otpEmailHTML(otp, "login verification"),
      });
      return res.json({ success: true, requires2FA: true, email });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error: " + error);
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      if (exists.isEmailVerified) {
        return res.json({
          success: false,
          message: "User already exists, Please Login",
        });
      }
      // Stale unverified user — delete and re-create
      await userModel.deleteOne({ _id: exists._id });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Invalid email format\nPlease enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      isEmailVerified: false,
    });
    await newUser.save();

    await sendEmail({
      to: email,
      subject: "Wick & Aura — Verify Your Email",
      html: otpEmailHTML(otp, "email verification"),
    });

    res.json({ success: true, requiresOTP: true, email });
  } catch (error) {
    console.log("Error:" + error);
    res.json({ success: false, message: error.message });
  }
};

// Verify signup OTP
const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email, isEmailVerified: false });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (!user.otp || !user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.json({
        success: false,
        message: "OTP expired, please resend",
      });
    }
    const valid = await verifyOTP(otp, user.otp);
    if (!valid) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Verify login 2FA OTP
const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email, isEmailVerified: true });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (!user.otp || !user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.json({
        success: false,
        message: "OTP expired, please resend",
      });
    }
    const valid = await verifyOTP(otp, user.otp);
    if (!valid) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Forgot password — send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email, isEmailVerified: true });
    if (!user) {
      return res.json({ success: false, message: "No account found with this email" });
    }
    const otp = generateOTP();
    user.otp = await hashOTP(otp);
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendEmail({
      to: email,
      subject: "Wick & Aura — Password Reset",
      html: otpEmailHTML(otp, "password reset"),
    });
    res.json({ success: true, email });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Verify forgot password OTP
const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email, isEmailVerified: true });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (!user.otp || !user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.json({
        success: false,
        message: "OTP expired, please resend",
      });
    }
    const valid = await verifyOTP(otp, user.otp);
    if (!valid) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    // OTP verified successfully - keep it for password reset
    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Reset password (OTP already verified)
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email, isEmailVerified: true });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (!user.otp || !user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.json({
        success: false,
        message: "OTP expired, please restart password reset",
      });
    }
    // Re-verify OTP as a security measure
    const valid = await verifyOTP(otp, user.otp);
    if (!valid) {
      return res.json({
        success: false,
        message: "Invalid OTP, please restart password reset",
      });
    }
    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Toggle 2FA (authenticated)
const toggle2FA = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    user.twoFactorEnabled = !user.twoFactorEnabled;
    await user.save();
    res.json({ success: true, twoFactorEnabled: user.twoFactorEnabled });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Resend OTP (rate-limited: 30s)
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    // Rate limit: if OTP was set less than 30s ago
    if (user.otpExpiry) {
      const setAt = new Date(user.otpExpiry.getTime() - 10 * 60 * 1000);
      if (Date.now() - setAt.getTime() < 30 * 1000) {
        return res.json({
          success: false,
          message: "Please wait before requesting another OTP",
        });
      }
    }
    const otp = generateOTP();
    user.otp = await hashOTP(otp);
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const purpose = user.isEmailVerified ? "verification" : "email verification";
    await sendEmail({
      to: email,
      subject: "Wick & Aura — Your New OTP",
      html: otpEmailHTML(otp, purpose),
    });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Route for getting user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Route for admin login

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = createToken(`${email + password}`);
    res.json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } else {
    res.json({
      success: false,
      message: "Invalid admin credentials",
    });
  }
};

export {
  loginUser,
  registerUser,
  getUserProfile,
  adminLogin,
  verifySignupOTP,
  verifyLoginOTP,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  toggle2FA,
  resendOTP,
};
