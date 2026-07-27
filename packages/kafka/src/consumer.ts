import { Kafka, Consumer } from "kafkajs";

export const CreateConsumer = (kafka: Kafka, groupId: string) => {
  const consumer: Consumer = kafka.consumer({ groupId });

  const connect = async () => {
    console.log(`kafka consumer is connected with groupId ${groupId}`);
    await consumer.connect();
  };

  const subscribe = async (
    topic: string,
    handler = (message: any) => Promise<void>,
  ) => {
    await consumer.subscribe({
      topic: topic,
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async ({ message, partition, topic }) => {
        try {
          const value = await message.value?.toString();
          if (value) {
            await handler(JSON.parse(value));
          }
        } catch (error) {
          console.log("Error in consumer run", error);
        }
      },
    });
  };
  const disconnect = async () => {
    await consumer.disconnect();
  };

  return { connect, subscribe, disconnect };
};
