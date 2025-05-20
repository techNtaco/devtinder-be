import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import requestRoutes from "./routes/request.routes";
import adminRoutes from "./routes/admin.routes";
import { FRONTEND_ORIGIN, isProd } from './config/constants';

const app = express();

app.use(express.json());
app.use(cookieParser());

console.log(`Running in ${isProd ? "production" : "development"} mode`);

app.use(cors({
  origin: FRONTEND_ORIGIN,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/admin", adminRoutes);

export default app;