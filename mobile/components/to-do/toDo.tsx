import { ToDoInput } from "@/components/to-do/ToDoInput";
import { ToDoList } from "@/components/to-do/ToDoList";

type ToDo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function ToDo() {
  const toDoListTest: ToDo[] = [{ id: 1, text: "testing", completed: false }];

  return (
    <>
      <ToDoInput onAddToDo={() => {}} />
      <ToDoList toDos={toDoListTest} />
    </>
  );
}
