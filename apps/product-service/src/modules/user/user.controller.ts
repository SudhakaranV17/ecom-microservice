import { type Request, type Response } from "express";
import { createUser } from "./user.service";
import logger from "../../middleware/Logger";

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    logger.info({ data: name }, "name");
    const user = await createUser(name, email, password);

    res.status(200).json({ message: "User created successfully", user });
  } catch (error) {
    logger.error({ error }, "Error in signup");
    res.status(500).json({ message: "Internal server error", error });
  }
}
