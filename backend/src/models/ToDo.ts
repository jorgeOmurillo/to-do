import mongoose, { Schema, Document } from "mongoose";

export interface IToDo extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
}

const toDoSchema = new Schema<IToDo>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: false },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const ToDo = mongoose.model<IToDo>("ToDo", toDoSchema);

export default ToDo;
