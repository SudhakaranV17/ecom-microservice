import logger from "../../middleware/Logger";
import { saveUser } from "./user.repository";

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  try {
    logger.info({ data: name }, "Service Name");
    const user = await saveUser(name, email, password);
    return user;
  } catch (error) {
    logger.error({ error }, "Error in createUser Service");
    throw error;
  }
}
