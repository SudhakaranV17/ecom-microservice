import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import type { CustomJwtSessionClaims } from "@repo/types";

export const authMiddleware = createMiddleware<{
  Variables: { userId: string };
}>(async (context, next) => {
  const { userId } = getAuth(context);
  if (!userId) {
    return context.json({ message: "Unauthorised from hono", userId: userId });
  }
  context.set("userId", userId);
  await next();
});

export const AccessControlMiddleware = createMiddleware<{
  Variables: { userId: string };
}>(async (context, next) => {
  const auth = getAuth(context);
  if (!auth.userId) {
    return context.json({
      message: "Unauthorised user - not logged in",
      userId: auth.userId,
    });
  }
  console.log(auth.sessionClaims);
  const claims = auth.sessionClaims as CustomJwtSessionClaims;
  console.log(claims.metadata?.role);
  if (claims.metadata?.role !== "admin") {
    return context.json({ message: "You are not authorized to access this" });
  }
  context.set("userId", auth.userId);
  await next();
});
