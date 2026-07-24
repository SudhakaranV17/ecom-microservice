import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authMiddleware } from "./middleware/authMiddleware.js";
import stripe from "./utils/stripe.js";

const app = new Hono();

app.use("*", clerkMiddleware());
app.get("/test", authMiddleware, (c) => {
  const userId = c.get("useId");
  return c.json({ message: "up from payment service", userId: userId });
});

app.get("/health", (c) => {
  return c.text("Hello Hono!");
});
app.post("/create-stripe-product", async (c) => {
  const res = await stripe.products.create({
    id: "1234",
    name: "product1",
    default_price_data: {
      currency: "inr",
      unit_amount: 10 * 20,
    },
  });
  return c.json(res);
});
app.get("/stripe-price-product", async (c) => {
  const res = await stripe.prices.list({
    product: "1234",
  });
  return c.json(res);
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
