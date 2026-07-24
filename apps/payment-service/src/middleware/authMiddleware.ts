import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import type { CustomJwtSessionClaims } from "@repo/types";

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

export const AccessControlMiddleware = createMiddleware<{
  Variables: { useId: string };
}>(async (context, next) => {
  const auth = getAuth(context);
  if (!auth.userId) {
    return context.json({
      message: "Unauthorised user - not logged in",
      userId: auth.userId,
    });
  }
  const claims = auth.sessionClaims as CustomJwtSessionClaims;
  if (claims.metadata?.role !== "admin") {
    return context.json({ message: "You are not authorized to access this" });
  }
  context.set("useId", auth.userId);
  await next();
});
