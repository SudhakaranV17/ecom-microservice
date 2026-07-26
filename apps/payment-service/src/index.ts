import { clerkMiddleware } from "@hono/clerk-auth";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authMiddleware } from "./middleware/authMiddleware.js";
import sessionRoute from "./routes/session.route.js";
import { cors } from "hono/cors";
import webhookRoute from "./routes/webhook.route.js";

const app = new Hono();

app.use("*", clerkMiddleware());
app.use(
  cors({
    origin: process.env.CLIENT_URL as string,
    allowHeaders: ["*"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.get("/test", authMiddleware, (c) => {
  const userId = c.get("userId");
  return c.json({ message: "up from payment service", userId: userId });
});

app.get("/health", (c) => {
  return c.text("Hello Hono!");
});

app.route("/session", sessionRoute);
app.route("/webhooks", webhookRoute);
// app.post("/create-stripe-product", async (c) => {
//   const res = await stripe.products.create({
//     id: "1",
//     name: "product2",
//     default_price_data: {
//       currency: "inr",
//       unit_amount: 100 * 20 * 100,
//     },
//   });
//   return c.json(res);
// });
// app.get("/stripe-price-product", async (c) => {
//   const res = await stripe.prices.list({
//     product: "1",
//   });
//   return c.json(res);
// });

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
