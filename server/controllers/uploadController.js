import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadImage = asyncHandler(async (req, res) => {
  // ← config moved here so .env is already loaded
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "mern-ecommerce",
  });

  res.json({ url: result.secure_url });
});
