import mongoose, { Schema, Document } from "mongoose";

export interface ISubmissionDocument extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  url: string;
  note: string;
  status: "pending" | "accepted" | "needs_improvement";
  feedback: string;
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmissionDocument>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    note: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "needs_improvement"],
      default: "pending",
    },
    feedback: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Submission ||
  mongoose.model<ISubmissionDocument>("Submission", SubmissionSchema);
