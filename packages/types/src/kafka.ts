export const KAFKA_TOPICS = {
  USER_CREATED: "user.created",
  PRODUCT_CREATED: "product.created",
  PRODUCT_DELETED: "product.deleted",
  ORDER_CREATED: "order.created",
  PAYMENT_COMPLETED: "payment.completed",
} as const;

export const KAFKA_SERVICE = {
  PRODUCT_SERVICE: "product-service",
  ORDER_SERVICE: "order-service",
  PAYMENT_SERVICE: "payment-service",
} as const;

export const KAFKA_GROUP_ID = {
  PRODUCT_GROUP: "product-group",
  ORDER_GROUP: "order-group",
  PAYMENT_GROUP: "payment-group",
} as const;
