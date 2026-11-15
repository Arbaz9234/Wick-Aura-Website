import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
      required: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
  },
  { minimize: false, versionKey: false },
);

const subscriptionModel =
  mongoose.models.subscription ||
  mongoose.model("subscription", subscriptionSchema);
export default subscriptionModel;
