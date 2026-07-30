import { IOrder } from "@repo/order-db";

export type OrderType = IOrder & {
  _id: string;
};
