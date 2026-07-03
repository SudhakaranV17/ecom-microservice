import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware";
import dns from "node:dns/promises";
import { pinoHttp } from "pino-http";
import logger from "./middleware/Logger";
import userRoute from "./modules/user/user.route";
import authRoute from "./modules/auth/auth.route";
import { clerkMiddleware, getAuth } from "@clerk/express";

dns.setServers(["1.1.1.1"]);
dotenv.config();

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

app.get("/test", (req, res) => {
  const { userId } = getAuth(req, res);
  console.log(userId);
  res.json({ message: "up from product service", userId });
});

// Error handler must come last
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  ErrorMiddleware(err, req, res, _next);
});
export default app;
