import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

import { useTodos } from "@/context/todoContext";
import ToDoAddScreen from "../toDoAdd";

jest.mock("@/context/todoContext", () => ({
  useTodos: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

describe("ToDoAddScreen", () => {
  const mockAddToDo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTodos as jest.Mock).mockReturnValue({
      addToDo: mockAddToDo,
    });
  });

  it("renders the initial screen correctly", () => {
    const { getByPlaceholderText, getByText } = render(<ToDoAddScreen />);

    expect(getByPlaceholderText("Enter ToDo title")).toBeTruthy();
    expect(getByPlaceholderText("Enter ToDo description")).toBeTruthy();

    expect(getByText("ADD")).toBeTruthy();
  });

  it("adds a ToDo successfully when the title is provided", async () => {
    const { getByPlaceholderText, getByText } = render(<ToDoAddScreen />);

    const titleInput = getByPlaceholderText("Enter ToDo title");
    const descriptionInput = getByPlaceholderText("Enter ToDo description");
    const addButton = getByText("ADD");

    fireEvent.changeText(titleInput, "Test ToDo");
    fireEvent.changeText(descriptionInput, "This is a test description.");
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(mockAddToDo).toHaveBeenCalledWith({
        title: "Test ToDo",
        description: "This is a test description.",
      });

      expect(router.navigate).toHaveBeenCalledWith("/(app)/(tabs)");
    });
  });
});
