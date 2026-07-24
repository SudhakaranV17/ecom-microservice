import stripe from "./stripe";
import type { StripeProductType } from "@repo/types";

export const createStripeProduct = async (item: StripeProductType) => {
  try {
    const product = await stripe.products.create({
      id: item.id,
      name: item.name,
      default_price_data: {
        currency: "inr",
        unit_amount: item.price * item.quantity * 100,
      },
    });
    return product;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getStripeProduct = async (productId: any) => {
  try {
    const product = await stripe.prices.list({
      product: productId,
    });
    return product.data[0]?.unit_amount;
  } catch (error) {
    console.log(error);
    return error;
  }
};
