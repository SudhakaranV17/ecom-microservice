import { KAFKA_TOPICS } from "@repo/types";
import { consumer } from "./kafka";
import { CreateOrder } from "./order";

export const runKafkaSubscriptions = async () => {
  await consumer.subscribe(
    KAFKA_TOPICS.PAYMENT_SUCCESSFULL,
    async (message) => {
      try {
        const order = message.value;
        await CreateOrder(order);
        console.log("payment successfull for the order: ", order);
      } catch (error) {
        console.log("Error in consumer payment successfull subscribe", error);
      }
    },
  );

  // ✅ Single run() call after all subscriptions
  await consumer.startConsuming();
};
