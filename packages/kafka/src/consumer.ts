import { Kafka, Consumer } from "kafkajs";

export const CreateConsumer = (kafka: Kafka, groupId: string) => {
  const consumer: Consumer = kafka.consumer({ groupId });
  // Topic -> handler map: multiple topics, single run()
  const handlers = new Map<string, (message: any) => Promise<void>>();

  const connect = async () => {
    console.log(`kafka consumer is connected with groupId ${groupId}`);
    await consumer.connect();
  };

  // Register topic + handler — does NOT call run() internally
  const subscribe = async (
    topic: string,
    handler: (message: any) => Promise<void>,
  ) => {
    handlers.set(topic, handler);
    await consumer.subscribe({
      topic: topic,
      fromBeginning: true,
    });
    console.log(`Subscribed to topic: ${topic}`);
  };

  // Call this ONCE after all subscribe() calls to start consuming
  const startConsuming = async () => {
    await consumer.run({
      eachMessage: async ({ message, topic }) => {
        try {
          console.log(`[Kafka Consumer] Received message on topic: ${topic}`);
          const value = message.value?.toString();
          console.log(`[Kafka Consumer] Raw value:`, value);
          if (value) {
            const handler = handlers.get(topic);
            console.log(
              `[Kafka Consumer] Handler found for ${topic}?`,
              !!handler,
            );
            if (handler) {
              await handler(JSON.parse(value));
            } else {
              console.log(
                `[Kafka Consumer] No handler registered for topic: ${topic}`,
              );
              console.log(
                `[Kafka Consumer] Available handlers for topics:`,
                Array.from(handlers.keys()),
              );
            }
          } else {
            console.log(`[Kafka Consumer] Message value is empty.`);
          }
        } catch (error) {
          console.log("Error in consumer run", error);
        }
      },
    });
    console.log(`Consumer started for group: ${groupId}`);
  };

  const disconnect = async () => {
    await consumer.disconnect();
  };

  return { connect, subscribe, startConsuming, disconnect };
};
