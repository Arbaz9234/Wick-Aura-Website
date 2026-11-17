import express from "express";
import {
  subscribe,
  unsubscribe,
  getSubscriptionStatus,
} from "../controllers/subscriptionController.js";

const subscriptionRouter = express.Router();

// Subscribe to newsletter
subscriptionRouter.post("/subscribe", subscribe);

// Unsubscribe from newsletter
subscriptionRouter.post("/unsubscribe", unsubscribe);

// Check newsletter subscription status
subscriptionRouter.get("/status", getSubscriptionStatus);

export default subscriptionRouter;
