export type UserRole = "instructor" | "student";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type SubmissionStatus = "pending" | "accepted" | "needs_improvement";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface IAssignment {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  difficulty: Difficulty;
  createdBy: string;
  createdAt: Date;
}

export interface ISubmission {
  _id: string;
  assignmentId: string | IAssignment;
  studentId: string | IUser;
  url: string;
  note: string;
  status: SubmissionStatus;
  feedback: string;
  createdAt: Date;
}
