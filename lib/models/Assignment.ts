import mongoose, { Schema, Document } from "mongoose";

export interface IAssignmentDocument extends Document {
  title: string;
  description: string;
  deadline: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AssignmentSchema = new Schema<IAssignmentDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Assignment ||
  mongoose.model<IAssignmentDocument>("Assignment", AssignmentSchema);
