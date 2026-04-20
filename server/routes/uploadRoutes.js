import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload, uploadImage } from "../controllers/uploadController.js";

const router = express.Router();
router.post("/", protect, admin, upload.single("image"), uploadImage);
export default router;
