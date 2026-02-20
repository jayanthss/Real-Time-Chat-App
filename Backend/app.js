import { config } from "dotenv";
config()
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messagesRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";


const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.client_URL,
    credentials: true,
  })
);

// routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);

export default app;
