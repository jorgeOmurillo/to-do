import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

import { useTodos } from "@/context/todoContext";
import HomeScreen from "..";

jest.mock("@/context/todoContext", () => ({
  useTodos: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

jest.mock("expo-font", () => {
  const module: typeof import("expo-font") = {
    ...jest.requireActual("expo-font"),
    isLoaded: jest.fn(() => true),
  };

  return module;
});

describe("HomeScreen", () => {
  const mockFetchToDos = jest.fn();
  const mockRemoveCompletedToDos = jest.fn();
  const mockToDos = [
    { _id: "1", title: "Task 1", completed: true },
    { _id: "2", title: "Task 2", completed: false },
    { _id: "3", title: "Task 3", completed: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useTodos as jest.Mock).mockReturnValue({
      fetchToDos: mockFetchToDos,
      removeCompletedToDos: mockRemoveCompletedToDos,
      toDos: mockToDos,
    });
  });

  it("renders the screen correctly with all components", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText("All")).toBeTruthy();
    expect(getByText("Completed")).toBeTruthy();
    expect(getByText("Incomplete")).toBeTruthy();
    expect(getByText("Remove Completed")).toBeTruthy();
  });

  it("calls fetchToDos on mount", async () => {
    render(<HomeScreen />);

    await waitFor(() => {
      expect(mockFetchToDos).toHaveBeenCalledTimes(1);
    });
  });

  it("filters ToDos correctly by status", () => {
    const { getByText, queryByText } = render(<HomeScreen />);

    expect(getByText("Task 1")).toBeTruthy();
    expect(getByText("Task 2")).toBeTruthy();
    expect(getByText("Task 3")).toBeTruthy();

    fireEvent.press(getByText("Completed"));
    expect(getByText("Task 1")).toBeTruthy();
    expect(getByText("Task 3")).toBeTruthy();
    expect(queryByText("Task 2")).toBeNull();

    fireEvent.press(getByText("Incomplete"));
    expect(getByText("Task 2")).toBeTruthy();
    expect(queryByText("Task 1")).toBeNull();
    expect(queryByText("Task 3")).toBeNull();
  });

  it("removes completed ToDos when 'Remove Completed' is pressed", async () => {
    const { getByText } = render(<HomeScreen />);

    fireEvent.press(getByText("Remove Completed"));

    await waitFor(() => {
      expect(mockRemoveCompletedToDos).toHaveBeenCalledTimes(1);
    });
  });

  it.only("navigates to the ToDo Add screen when the 'Add' button is pressed", () => {
    const { getByTestId } = render(<HomeScreen />);

    const addButton = getByTestId("toDoAddButton");
    fireEvent.press(addButton);

    expect(router.navigate).toHaveBeenCalledWith("/(app)/(todo)/toDoAdd");
  });
});
