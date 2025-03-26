import { RouteFactory } from "../utils/route-factory";
import { PIAController } from "../controllers/pia.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { rateLimit } from "express-rate-limit";
import { config } from "../config";

export const createPIARoutes = () => {
  const factory = new RouteFactory();
  const piaController = PIAController.getInstance();

  // Rate limiting specific for PIA endpoints
  const piaRateLimit = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: 20, // lower limit for PIA endpoints
    message: "Too many requests to PIA, please try again later.",
  });

  return factory
    .addRoute({
      path: "/",
      method: "post",
      handler: piaController.handleQuestion.bind(piaController),
      auth: true,
      rateLimit: {
        windowMs: config.rateLimit.windowMs,
        max: 20,
      },
      middlewares: [piaRateLimit],
    })
    .addRoute({
      path: "/suggestions",
      method: "post",
      handler: piaController.getSuggestions.bind(piaController),
      auth: true,
      rateLimit: {
        windowMs: config.rateLimit.windowMs,
        max: 30,
      },
      middlewares: [piaRateLimit],
    })
    .getRouter();
};
