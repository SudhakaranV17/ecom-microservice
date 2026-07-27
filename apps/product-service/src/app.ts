import { clerkMiddleware, getAuth } from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import dns from "node:dns/promises";
import { pinoHttp } from "pino-http";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware";
import logger from "./middleware/Logger";
import authRoute from "./modules/auth/auth.route";
import categoryRoute from "./modules/category/category.route";
import productRoute from "./modules/product/product.route";
import userRoute from "./modules/user/user.route";
dotenv.config();

dns.setServers(["1.1.1.1"]);

const app: express.Application = express();

// Middleware — cast to any where third-party types don't match Express 5 generics
app.use(pinoHttp({ logger }));
app.use(clerkMiddleware());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/products", productRoute);

app.get("/test", (req, res) => {
  const { userId } = getAuth(req);
  logger.info(`test endpoint accessed ${JSON.stringify(userId, null, 2)}`);
  console.log(userId);
  res.json({ message: "up from product service", userId });
});

// Error handler must come last
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  ErrorMiddleware(err, req, res, _next);
});
export default app;
