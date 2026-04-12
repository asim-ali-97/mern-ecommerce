import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (we'll add these as we build them)
app.get("/", (req, res) => res.send({ name: "asim", age: 43 }));

// Error handler (we'll build this next)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
