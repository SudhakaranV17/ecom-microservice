import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { signup } from "./user.controller";

const router = express.Router();

router.post("/signup", signup);

export default router;
