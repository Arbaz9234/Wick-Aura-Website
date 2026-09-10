import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  getUserProfile,
} from "../controllers/userController.js";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/profile", authUser, getUserProfile);

// Address routes
userRouter.post("/addresses", authUser, getAddresses);
userRouter.post("/address/add", authUser, addAddress);
userRouter.post("/address/update", authUser, updateAddress);
userRouter.post("/address/delete", authUser, deleteAddress);

export default userRouter;
