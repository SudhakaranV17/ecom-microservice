import { Hono } from "hono";
import stripe from "../utils/stripe";
import { AccessControlMiddleware } from "../middleware/authMiddleware";
import { CartItemsType } from "@repo/types";
import { getStripeProductPrice } from "../utils/stripeProduct";

const sessionRoute = new Hono();

sessionRoute.post(
  "/create-checkout-session",
  AccessControlMiddleware,
  async (c) => {
    const { cart, shippingForm }: { cart: CartItemsType; shippingForm: any } =
      await c.req.json();
    console.log(cart, shippingForm);
    const userId = c.get("userId");
    // get cart price
    const lineItems = await Promise.all(
      cart.map(async (item) => {
        const unitAmount = await getStripeProductPrice(item.id);
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
            },
            unit_amount: unitAmount as number,
          },
          quantity: item.quantity,
        };
      }),
    );
    // create session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "elements",
      customer_email: shippingForm.email,
      line_items: lineItems,
      client_reference_id: userId,
      mode: "payment",
      return_url:
        "http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}",
    });
    return c.json({ checkoutSessionClientSecret: session.client_secret });
  },
);
sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items"],
  });
  return c.json({
    status: session.status,
    payment_status: session.payment_status,
  });
});
export default sessionRoute;
