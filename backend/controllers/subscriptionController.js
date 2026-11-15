import validator from "validator";
import subscriptionModel from "../models/subscriptionModel.js";

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    email = email.trim().toLowerCase();

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check if email already exists
    const existingSubscription = await subscriptionModel.findOne({
      email,
    });

    if (existingSubscription) {
      if (existingSubscription.isSubscribed) {
        return res.status(200).json({
          success: true,
          message: "You are already subscribed to our newsletter",
        });
      }

      // Resubscribe an existing subscriber
      existingSubscription.isSubscribed = true;
      existingSubscription.subscribedAt = new Date();
      existingSubscription.unsubscribedAt = null;

      await existingSubscription.save();

      return res.status(200).json({
        success: true,
        message: "You have successfully subscribed to our newsletter",
      });
    }

    // Create a new subscription
    await subscriptionModel.create({
      email,
      isSubscribed: true,
      subscribedAt: new Date(),
      unsubscribedAt: null,
    });

    return res.status(201).json({
      success: true,
      message: "You have successfully subscribed to our newsletter",
    });
  } catch (error) {
    console.error("Subscribe error:", error);

    // Handle duplicate email race condition
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Subscription request received",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    email = email.trim().toLowerCase();

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const subscription = await subscriptionModel.findOneAndUpdate(
      { email, isSubscribed: true },
      {
        $set: {
          isSubscribed: false,
          unsubscribedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!subscription) {
      return res.status(200).json({
        success: true,
        message: "If this email was subscribed, it has been unsubscribed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "You have successfully unsubscribed",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

// Check subscription status
const getSubscriptionStatus = async (req, res) => {
  try {
    let { email } = req.query;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    email = email.trim().toLowerCase();

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const subscription = await subscriptionModel.findOne(
      { email },
      { isSubscribed: 1, _id: 0 },
    );

    return res.status(200).json({
      success: true,
      isSubscribed: subscription?.isSubscribed ?? false,
    });
  } catch (error) {
    console.error("Get subscription status error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

export { subscribe, unsubscribe, getSubscriptionStatus };
