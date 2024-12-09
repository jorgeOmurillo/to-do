import express from "express";
import ToDo from "../models/ToDo";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Create a toDo
router.post("/todos", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const userId = (req as any).user._id;

  try {
    const newToDo = new ToDo({ userId, title, description });
    await newToDo.save();
    res.status(201).json(newToDo);
  } catch (error) {
    res.status(400).json({ message: "Error creating To-Do", error });
  }
});

// Retrieve toDos
router.get("/todos", authMiddleware, async (req, res) => {
  const userId = (req as any).user._id;

  try {
    const toDos = await ToDo.find({ userId });
    res.json(toDos);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving To-Dos", error });
  }
});

// Retrieve a toDo
router.get("/todo/:id", authMiddleware, async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const toDo = await ToDo.findById(id);
    res.json(toDo);
  } catch (error) {
    res.status(500).json({ message: "Error retrieiving To-Do", error });
  }
});

// Update a toDo
router.put("/todo/:id", authMiddleware, async (req: any, res: any) => {
  const { id } = req.params;

  const updates = req.body;

  try {
    const updatedToDo = await ToDo.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedToDo)
      return res.status(404).json({ message: "To-Do not found" });
    res.json(updatedToDo);
  } catch (error) {
    res.status(400).json({ message: "Error updating To-Do", error });
  }
});

// Delete a toDo
router.delete("/todo/:id", authMiddleware, async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const deletedToDo = await ToDo.findByIdAndDelete(id);
    if (!deletedToDo)
      return res.status(404).json({ message: "ToDo not found" });
    res.json({ message: "To-Do deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting To-Do", error });
  }
});

// Delete all completed toDos
router.delete(
  "/todos/completed",
  authMiddleware,
  async (req: any, res: any) => {
    const userId = req.user._id;

    try {
      const result = await ToDo.deleteMany({ userId, completed: true });

      res.json({
        message: "Completed To-Dos deleted successfully",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting completed To-Dos", error });
    }
  }
);

export default router;
