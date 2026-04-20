import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Get all products (with search + pagination)
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc    Create product (admin)
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user._id,
    name: "Sample name",
    images: [],
    brand: "Punar",
    category: "Rug",
    description: "Sample Description",
    price: 0,
    countInStock: 0,
  });
  const created = await product.save();
  res.status(201).json(created);
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, images, brand, category, countInStock } =
    req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.name = name;
  product.price = price;
  product.description = description;
  product.images = images;
  product.brand = brand;
  product.category = category;
  product.countInStock = countInStock;

  const updated = await product.save();
  res.json(updated);
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.deleteOne();
  res.json({ message: "Product removed" });
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString(),
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
