import { KAFKA_TOPICS, StripeProductType } from "@repo/types";
import { consumer } from "./kafka";
import { createStripeProduct, deleteStripeProduct } from "./stripeProduct";

export const runKafkaSubscriptions = async () => {
  consumer.subscribe(KAFKA_TOPICS.PRODUCT_CREATED, async (message) => {
    try {
      const product = message.value as StripeProductType;
      console.log("product created in kafka", product);
      await createStripeProduct(product);
    } catch (error) {
      console.log("Error in consumer product created subscribe", error);
    }
  });
  consumer.subscribe(KAFKA_TOPICS.PRODUCT_DELETED, async (message) => {
    try {
      const productId = message.value as number;
      console.log("product deleted in kafka", productId);
      await deleteStripeProduct(productId);
    } catch (error) {
      console.log("Error in consumer product deleted subscribe", error);
    }
  });
};
