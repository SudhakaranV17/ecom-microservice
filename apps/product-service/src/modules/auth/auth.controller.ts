import { clerkClient, getAuth } from "@clerk/express";
import UserModel from "../user/user.model";
import type { NextFunction, Request, Response } from "express";
import logger from "../../middleware/Logger";

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId; // string — set by ProtectedRoute
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error({ error }, "getMe error");
    next(error);
  }
}

export async function authCallback(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId: authId } = getAuth(req);
    if (!authId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await UserModel.findOne({ authId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(authId);
      // Guarantee string — exactOptionalPropertyTypes rejects string | undefined
      const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress ?? "";
      const displayName = clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
        : primaryEmail.split("@")[0] ?? authId;
      user = await UserModel.create({
        authId,
        email: primaryEmail,
        name: displayName,
      });
      logger.info({ userId: user._id }, "auth: new user created");
      return res.status(201).json(user);
    }

    logger.info({ userId: user._id }, "auth: existing user returned");
    res.status(200).json(user);
  } catch (error) {
    logger.error({ error }, "auth callback error");
    next(error);
  }
}
