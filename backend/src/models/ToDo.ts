import mongoose, { Schema, Document } from "mongoose";

export interface IToDo extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
}

const toDoSchema = new Schema<IToDo>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const ToDo = mongoose.model<IToDo>("ToDo", toDoSchema);

export default ToDo;
