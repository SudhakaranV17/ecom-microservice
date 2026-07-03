import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = new Hono();

app.use("*", clerkMiddleware());
app.get("/test", authMiddleware, (c) => {
  const userId = c.get("useId");
  return c.json({ message: "up from payment service", userId: userId });
});

app.get("/health", (c) => {
  return c.text("Hello Hono!");
});

const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
      },
    );
  } catch (error) {
    console.log("Error starting hono server", error);
    process.exit(1);
  }
};

start();
