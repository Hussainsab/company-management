import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "./src/config/database";
import { seedAdmin } from "./seed";
import authRouter from "./src/modules/auth/auth.routes";
import userRoutes from "./src/modules/user/user.routes";
import companyRoutes from "./src/modules/company/company.routes";
import serviceRoutes from "./src/modules/service/service.routes";
import serviceRequestRoutes from "./src/modules/service-request/service-request.routes";
import projectRoutes from "./src/modules/project/project.routes";
import messageRoutes from "./src/modules/message/message.routes";
import dashboardRoutes from "./src/modules/dashboard/dashboard.routes";
import { authenticate } from "./src/middlewares/auth.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

// ── Public routes ──────────────────────────────────────────
app.use("/auth", authRouter);

// ── Protected routes (JWT required) ───────────────────────
app.use("/users", authenticate, userRoutes);
app.use("/companies", authenticate, companyRoutes);
app.use("/services", authenticate, serviceRoutes);
app.use("/service-requests", authenticate, serviceRequestRoutes);
app.use("/projects", authenticate, projectRoutes);
app.use("/messages", authenticate, messageRoutes);
app.use("/dashboard", authenticate, dashboardRoutes);

// ── Health check ───────────────────────────────────────────
app.get("/health", (_req, res) =>
    res.json({ status: "ok", company: "Hussain Software Solutions" })
);

// ── 404 handler ────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Route not found" } });
});

// ── Centralized error handler (must be last) ───────────────
app.use(errorHandler);

// ── Bootstrap ──────────────────────────────────────────────
async function bootstrap() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log("✅ Database connected and synced");

        // Seed default admin if it doesn't exist
        await seedAdmin();

        app.listen(PORT, () => {
            console.log(`🚀 Hussain Software Solutions API → http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

bootstrap();