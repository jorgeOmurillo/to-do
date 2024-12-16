import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useTodos } from "@/context/todoContext";
import { getToDoById } from "@/api/todoService";
import ToDoEditScreen from "../toDoEdit";

jest.mock("@/context/todoContext", () => ({
  useTodos: jest.fn(),
}));

jest.mock("@/api/todoService", () => ({
  getToDoById: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

describe("ToDoEditScreen", () => {
  const mockEditToDo = jest.fn();
  const mockToDo = {
    id: "1",
    title: "Test ToDo",
    description: "Test Description",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useTodos as jest.Mock).mockReturnValue({
      editToDo: mockEditToDo,
    });

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: mockToDo.id,
    });

    (getToDoById as jest.Mock).mockResolvedValue(mockToDo);
  });

  it("renders the screen correctly", async () => {
    const { getByPlaceholderText, getByText } = render(<ToDoEditScreen />);

    await waitFor(() => {
      expect(getByPlaceholderText("Enter ToDo title").props.value).toBe(
        mockToDo.title
      );
      expect(getByPlaceholderText("Enter ToDo description").props.value).toBe(
        mockToDo.description
      );
    });

    expect(getByText("EDIT")).toBeTruthy();
    expect(getByText("Cancel")).toBeTruthy();
  });

  it("preloads ToDo details using the getToDoById function", async () => {
    render(<ToDoEditScreen />);

    await waitFor(() => {
      expect(getToDoById).toHaveBeenCalledWith(mockToDo.id);
    });
  });

  it("shows an alert if the title is empty", async () => {
    const { getByText, getByPlaceholderText } = render(<ToDoEditScreen />);

    await waitFor(() => {});

    const titleInput = getByPlaceholderText("Enter ToDo title");
    const editButton = getByText("EDIT");

    fireEvent.changeText(titleInput, "");
    fireEvent.press(editButton);

    expect(mockEditToDo).not.toHaveBeenCalled();
  });

  it("edits a ToDo successfully", async () => {
    const { getByText, getByPlaceholderText } = render(<ToDoEditScreen />);

    await waitFor(() => {});

    const titleInput = getByPlaceholderText("Enter ToDo title");
    const descriptionInput = getByPlaceholderText("Enter ToDo description");
    const editButton = getByText("EDIT");

    fireEvent.changeText(titleInput, "Updated Title");
    fireEvent.changeText(descriptionInput, "Updated Description");
    fireEvent.press(editButton);

    await waitFor(() => {
      expect(mockEditToDo).toHaveBeenCalledWith(mockToDo.id, {
        title: "Updated Title",
        description: "Updated Description",
      });

      expect(router.navigate).toHaveBeenCalledWith("/(app)/(tabs)");
    });
  });

  it("navigates back to the previous screen on Cancel", async () => {
    const { getByText } = render(<ToDoEditScreen />);

    const cancelButton = getByText("Cancel");
    fireEvent.press(cancelButton);

    await waitFor(() => {
      expect(router.back).toHaveBeenCalled();
    });
  });
});
