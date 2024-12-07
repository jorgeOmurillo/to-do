export const API_URL = process.env.API_URL;

export async function getToDos() {
  try {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
}

export async function createToDo(title: string) {
  try {
    const response = await fetch(`${API_URL}/todo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false }),
    });
    if (!response.ok) {
      throw new Error("Failed to create todo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
}

export async function updateToDo(
  id: string,
  updates: Partial<{ title: string; completed: boolean }>
) {
  try {
    const response = await fetch(`${API_URL}/todo/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error("Failed to update todo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
}

export async function deleteToDo(id: string) {
  try {
    const response = await fetch(`${API_URL}/todo/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
}
