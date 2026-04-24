import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "instructor" | "student";
  createdAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["instructor", "student"], default: "student" },
  },
  { timestamps: true },
);

export default mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema);
