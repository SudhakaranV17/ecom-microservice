import mongoose, { Schema, model } from "mongoose";

export const orderStatus = ["SUCCESS", "FAILED", "PENDING"] as const;

export interface IOrder {
  userId: string;
  email: string;
  amount: number;
  status: string;
  stripeSessionId: string;
  products: object;
}
const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "PENDING", enum: orderStatus },
    stripeSessionId: { type: String, required: true, unique: true },
    products: {
      type: [
        {
          name: { type: String },
          quantity: { type: Number },
          price: { type: Number },
        },
      ],
      required: true,
    },
  },
  { timestamps: true },
);

export const orderSchemaType = mongoose.SchemaType<typeof orderSchema>;

export const Order = model<IOrder>("Order", orderSchema);
