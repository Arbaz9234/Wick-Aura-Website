import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  getUserProfile,
  verifySignupOTP,
  verifyLoginOTP,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  toggle2FA,
  resendOTP,
} from "../controllers/userController.js";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/profile", authUser, getUserProfile);

// OTP & auth routes
userRouter.post("/verify-signup-otp", verifySignupOTP);
userRouter.post("/verify-login-otp", verifyLoginOTP);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-forgot-password-otp", verifyForgotPasswordOTP);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/resend-otp", resendOTP);
userRouter.post("/toggle-2fa", authUser, toggle2FA);

// Address routes
userRouter.post("/addresses", authUser, getAddresses);
userRouter.post("/address/add", authUser, addAddress);
userRouter.post("/address/update", authUser, updateAddress);
userRouter.post("/address/delete", authUser, deleteAddress);

// Wishlist routes
userRouter.post("/wishlist", authUser, getWishlist);
userRouter.post("/wishlist/add", authUser, addToWishlist);
userRouter.post("/wishlist/remove", authUser, removeFromWishlist);

export default userRouter;
