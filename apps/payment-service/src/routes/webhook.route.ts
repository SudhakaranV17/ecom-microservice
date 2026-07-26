import { Hono } from "hono";
import stripe from "../utils/stripe";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const webhookRoute = new Hono();

webhookRoute.post("/stripe", async (c) => {
  const body = c.req.text();
  const signature = c.req.header("stripe-signature");

  if (!signature) {
    return c.json({ error: "signature is required" }, 400);
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await body,
      signature,
      webhookSecret!,
    );
  } catch (error) {
    console.log(error);
    return c.json({ error: "signature is invalid" }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );
      //   todo : create order
      console.log("webhook recived", session);
      console.log("Checkout session completed:", lineItems);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return c.json({ succsess: true });
});

export default webhookRoute;
