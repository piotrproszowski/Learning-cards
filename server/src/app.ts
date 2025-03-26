import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { config } from "./config";
import { createAuthRoutes } from "./routes/auth.routes";
import { createCardRoutes } from "./routes/card.routes";
import { createDeckRoutes } from "./routes/deck.routes";
import { createPIARoutes } from "./routes/pia.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Global middleware
app.use(helmet());
app.use(compression());
app.use(cors(config.cors));
app.use(express.json());

// Routes
app.use("/api/auth", createAuthRoutes());
app.use("/api/cards", createCardRoutes());
app.use("/api/decks", createDeckRoutes());
app.use("/api/pia", createPIARoutes());

// Error handling
app.use(errorHandler);

export default app;
