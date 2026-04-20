import express from "express";
import asyncHandler from "express-async-handler";
import { protect, admin } from "../middleware/authMiddleware.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
router.get(
  "/stats",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const recentOrders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const salesByMonth = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      recentOrders,
      salesByMonth,
    });
  }),
);

export default router;
