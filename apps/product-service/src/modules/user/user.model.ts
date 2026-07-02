import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  authId: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    authId: {
      type: String,
      required: true,
      unique: true, // prevents duplicate Clerk users
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    // password intentionally omitted — Clerk manages auth
  },
  { timestamps: true },
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
