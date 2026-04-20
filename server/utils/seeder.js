import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const sampleUser = {
  name: "Admin",
  email: "admin@yopmail.com",
  password: "Secret@123",
  isAdmin: true,
};

const sampleProducts = [
  {
    name: "Wireless Headphones",
    brand: "SoundMax",
    category: "Electronics",
    description: "Premium noise-cancelling wireless headphones.",
    price: 129.99,
    countInStock: 20,
    images: ["https://placehold.co/400x400?text=Headphones"],
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: "Running Shoes",
    brand: "Swiftfoot",
    category: "Footwear",
    description: "Lightweight running shoes for everyday training.",
    price: 89.99,
    countInStock: 15,
    images: ["https://placehold.co/400x400?text=Shoes"],
    rating: 4.2,
    numReviews: 8,
  },
  {
    name: "Mechanical Keyboard",
    brand: "TypePro",
    category: "Electronics",
    description: "Tactile mechanical keyboard with RGB lighting.",
    price: 74.99,
    countInStock: 10,
    images: ["https://placehold.co/400x400?text=Keyboard"],
    rating: 4.7,
    numReviews: 20,
  },
];

const seedDB = async () => {
  await User.deleteMany();
  await Product.deleteMany();

  const user = await User.create(sampleUser);
  // const products = sampleProducts.map((p) => ({ ...p, user: user._id }));
  // await Product.insertMany(products);
  // console.log("Database has been cleared..");
  console.log("Database seeded!");
  process.exit();
};

seedDB();
