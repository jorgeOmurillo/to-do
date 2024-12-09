import { fetchWithAuth } from "@/api/fetchWithAuth";

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getToDos() {
  return await fetchWithAuth("/todos");
}

export async function getToDoById(id: string) {
  return await fetchWithAuth(`/todo/${id}`, {
    method: "GET",
  });
}

export async function createToDo(toDoDetails: {
  title: string;
  description?: string;
}) {
  return await fetchWithAuth("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...toDoDetails, completed: false }),
  });
}

export async function updateToDo(
  id: string,
  updates: Partial<{ title: string; completed: boolean }>
) {
  return await fetchWithAuth(`/todo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export async function deleteToDo(id: string) {
  return await fetchWithAuth(`/todo/${id}`, {
    method: "DELETE",
  });
}

export async function deleteCompletedToDos() {
  return await fetchWithAuth(`/todos/completed`, {
    method: "DELETE",
  });
}
