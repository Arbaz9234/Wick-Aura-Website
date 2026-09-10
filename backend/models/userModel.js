import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartData: {
      type: Object,
      default: {},
    },
    addresses: [
      {
        firstName: String,
        lastName: String,
        mobile: String,
        address1: String,
        address2: String,
        landmark: String,
        pincode: String,
        city: String,
        state: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { minimize: false, versionKey: false },
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
