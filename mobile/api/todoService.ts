import { fetchWithAuth } from "@/api/fetchWithAuth";

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getToDos() {
  return await fetchWithAuth("/todos");
}

export async function createToDo(title: string) {
  return await fetchWithAuth("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description: "text", completed: false }),
  });
}

export async function updateToDo(
  id: string,
  updates: Partial<{ title: string; completed: boolean }>
) {
  return await fetchWithAuth(`/todo/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export async function deleteToDo(id: string) {
  return await fetchWithAuth(`/todo/${id}`, {
    method: "DELETE",
  });
}
