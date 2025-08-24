import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import { sequelize } from './config/sequelize';
import config from './config/config';
import authRoutes from './routes/auth';
import roomRoutes from "./routes/room";
import bookingRoutes from "./routes/booking";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

// Global error handler
app.use(errorHandler);

(async () => {
  await sequelize.authenticate();
  console.log('Database connected');
  app.listen(config.port, () => console.log(`API on :${config.port}`));
})();

export default app;