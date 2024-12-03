import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./drivers/database/data-source";
import authRouter from "./adapters/routes/auth.routes";
import { CustomError } from "./common/types/custom-error";
import { errorHandler } from "./adapters/middleware/error.middleware";

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

async function startServer() {
  try {
    // Inicializar la base de datos
    await AppDataSource.initialize();
    console.log("📦 Database connected successfully");

    app.use(express.json());
    // Error handling
    app.use(errorHandler);

    app.use("/", authRouter);

    // Iniciar el servidor HTTP
    app
      .listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
      })
      .on("error", (error) => {
        // gracefully handle error
        throw new Error(error.message);
      });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

startServer();
