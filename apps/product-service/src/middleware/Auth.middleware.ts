import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import UserModel from "../modules/user/user.model";
import logger from "./Logger";

export const ProtectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId: authId } = getAuth(req);
    if (!authId) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }
    const user = await UserModel.findOne({ authId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.userId = user._id.toString();
    next();
  } catch (error) {
    logger.error(`Error checking access ${error}`);
    res.status(500);
    next(error);
  }
};
