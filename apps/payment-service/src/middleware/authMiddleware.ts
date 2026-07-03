import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware<{
  Variables: { useId: string };
}>(async (context, next) => {
  const { userId } = getAuth(context);
  if (!userId) {
    return context.json({ message: "Unauthorised from hono", userId: userId });
  }
  context.set("useId", userId);
  await next();
});
