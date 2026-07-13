import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generating user token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        success: false,
        message:
          "Incorrect email or password. Please check your credentials and try again.",
      });
    } else {
      const token = createToken(user._id);
      res.json({
        success: true,
        token,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
    console.log("Error: " + error);
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // Validating email and password
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

    // Hashing User Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new User
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log("Error:" + error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Route for getting user profile
const getUserProfile = async (req, res) => {
  // Logic for getting user profile
};

// Route for admin login

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  // Logic for admin login
};

export { loginUser, registerUser, getUserProfile, adminLogin };
