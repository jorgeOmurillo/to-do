import React, { createContext, useContext, useState } from "react";
import {
  getToDos,
  createToDo,
  updateToDo,
  deleteToDo,
  deleteCompletedToDos,
} from "@/api/todoService";

export type ToDo = {
  _id: string;
  description: string;
  title: string;
  completed: boolean;
};

type ToDoContextType = {
  toDos: ToDo[];
  fetchToDos: () => Promise<void>;
  addToDo: ({
    title,
    description,
  }: {
    title: string;
    description?: string;
  }) => Promise<void>;
  editToDo: (id: string, updates: Partial<ToDo>) => Promise<void>;
  removeToDo: (id: string) => Promise<void>;
  removeCompletedToDos: () => Promise<void>;
};

const ToDoContext = createContext<ToDoContextType | undefined>(undefined);

export const ToDoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toDos, setToDos] = useState<ToDo[]>([]);

  const fetchToDos = async () => {
    try {
      const data = await getToDos();
      setToDos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addToDo = async (toDoDetails: {
    title: string;
    description?: string;
  }) => {
    try {
      const newToDo = await createToDo(toDoDetails);
      setToDos((prev) => [...prev, newToDo]);
    } catch (error) {
      console.error("Error adding to-do:", error);
    }
  };

  const editToDo = async (id: string, updates: Partial<ToDo>) => {
    try {
      const updatedToDo = await updateToDo(id, updates);
      setToDos((prev) =>
        prev.map((toDo) => (toDo._id === id ? updatedToDo : toDo))
      );
    } catch (error) {
      console.error("Error updating to-do:", error);
    }
  };

  const removeToDo = async (id: string) => {
    try {
      await deleteToDo(id);
      setToDos((prev) => prev.filter((toDo) => toDo._id !== id));
    } catch (error) {
      console.error("Error removing to-do:", error);
    }
  };

  const removeCompletedToDos = async () => {
    try {
      await deleteCompletedToDos();
      setToDos((prev) => prev.filter((toDo) => !toDo.completed));
    } catch (error) {
      console.error("Error removing to-do:", error);
    }
  };

  return (
    <ToDoContext.Provider
      value={{
        toDos,
        fetchToDos,
        addToDo,
        editToDo,
        removeToDo,
        removeCompletedToDos,
      }}
    >
      {children}
    </ToDoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(ToDoContext);
  if (!context) {
    throw new Error("useToDos must be used within a ToDoProvider");
  }
  return context;
};
