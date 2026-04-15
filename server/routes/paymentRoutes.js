import express from "express";
import Stripe from "stripe";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.post(
  "/create-payment-intent",
  protect,
  asyncHandler(async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // moved inside

    const { totalPrice } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  }),
);

export default router;
