import logger from "../../middleware/Logger";
import UserModel from "./user.model";

export async function saveUser(name: string, email: string, password: string) {
  try {
    const newUser = new UserModel({ name, email, password });
    logger.info({ data: newUser }, "New User Data");
    return await newUser.save();
  } catch (error) {
    logger.error({ error }, "Error in saveUser");
    throw error;
  }
}
