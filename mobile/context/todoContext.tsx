import React, { createContext, useContext, useState } from "react";
import {
  getToDos,
  createToDo,
  updateToDo,
  deleteToDo,
} from "@/api/todoService";

export type ToDo = {
  id: string;
  description: string;
  title: string;
  completed: boolean;
};

type ToDoContextType = {
  toDos: ToDo[];
  fetchToDos: () => Promise<void>;
  addToDo: (title: string) => Promise<void>;
  editToDo: (id: string, updates: Partial<ToDo>) => Promise<void>;
  removeToDo: (id: string) => Promise<void>;
};

const ToDoContext = createContext<ToDoContextType | undefined>(undefined);

export const ToDoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toDos, setToDos] = useState<ToDo[]>([]);

  const fetchToDos = async () => {
    const data = await getToDos();
    setToDos(data);
  };

  const addToDo = async (title: string) => {
    const newToDo = await createToDo(title);
    setToDos((prev) => [...prev, newToDo]);
  };

  const editToDo = async (id: string, updates: Partial<ToDo>) => {
    const updatedToDo = await updateToDo(id, updates);
    setToDos((prev) =>
      prev.map((toDo) => (toDo.id === id ? updatedToDo : toDo))
    );
  };

  const removeToDo = async (id: string) => {
    await deleteToDo(id);
    setToDos((prev) => prev.filter((toDo) => toDo.id !== id));
  };

  return (
    <ToDoContext.Provider
      value={{ toDos, fetchToDos, addToDo, editToDo, removeToDo }}
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
