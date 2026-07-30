import { Order } from "@repo/order-db";
import { OrderType } from "@repo/types";

export const CreateOrder = async (order: OrderType) => {
  try {
    // Check for idempotency: does this order already exist?
    const existingOrder = await Order.findOne({
      stripeSessionId: order.stripeSessionId,
    });
    if (existingOrder) {
      console.log(
        `Order already exists for stripe session: ${order.stripeSessionId}`,
      );
      return true; // Already processed successfully
    }

    const newOrder = new Order(order);
    const savedOrder = await newOrder.save();
    if (savedOrder) {
      console.log("Order created successfully");
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error in order creation:", error);
  }
};
