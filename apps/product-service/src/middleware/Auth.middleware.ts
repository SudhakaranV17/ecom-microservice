import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import UserModel from "../modules/user/user.model";
import logger from "./Logger";
import type { CustomJwtSessionClaims } from "@repo/types";

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
    // const user = await UserModel.findOne({ authId });
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }
    req.userId = authId;
    next();
  } catch (error) {
    logger.error(`Error checking access ${error}`);
    res.status(500);
    next(error);
  }
};
export const AccessControlMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      return res.status(401).json({ message: "Unauthorized - not logged in" });
    }
    const claims = auth.sessionClaims as CustomJwtSessionClaims;
    if (claims.metadata?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this" });
    }
    req.userId = auth.userId;
    next();
  } catch (error) {
    logger.error(`Error checking access ${error}`);
    res.status(500);
    next(error);
  }
};
