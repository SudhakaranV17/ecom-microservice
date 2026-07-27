import { Kafka, Producer } from "kafkajs";

export const CreateProducer = (kafka: Kafka) => {
  const producer: Producer = kafka.producer();

  const connect = async () => {
    console.log(`kafka producer is connected}`);
    await producer.connect();
  };

  const send = async (topic: string, message: object) => {
    try {
      // console.log(topic, message);
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (error) {
      console.log("Error in producer send", error);
    }
  };
  const disconnect = async () => {
    await producer.disconnect();
  };
  return { connect, send, disconnect };
};
