import { type Request, type Response } from "express";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware";
import dns from "node:dns/promises";
import { pinoHttp } from "pino-http";
import logger from "./middleware/Logger";
import userRoute from "./modules/user/user.route";
dns.setServers(["1.1.1.1"]);

dotenv.config();

const app: express.Application = express();
app.use(
  pinoHttp({
    logger,
  }),
);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
  return res.json({ status: "OK", message: "Server is running" });
});

app.use("/user", userRoute);

app.use(ErrorMiddleware);

export default app;
