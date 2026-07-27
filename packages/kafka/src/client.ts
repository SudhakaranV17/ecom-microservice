import { Kafka } from "kafkajs";

export const createKafkaClient = (service: string) => {
  return new Kafka({
    clientId: service,
    brokers: ["localhost:9092", "localhost:9093", "localhost:9094"],
  });
};
