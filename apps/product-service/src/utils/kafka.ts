import { CreateConsumer, createKafkaClient, CreateProducer } from "@repo/kafka";
import { KAFKA_SERVICE, KAFKA_GROUP_ID } from "@repo/types";

const kafkaClient = createKafkaClient(KAFKA_SERVICE.PRODUCT_SERVICE);

export const producer = CreateProducer(kafkaClient);
export const consumer = CreateConsumer(
  kafkaClient,
  KAFKA_GROUP_ID.PRODUCT_GROUP,
);
