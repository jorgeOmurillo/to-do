import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

import { useSession } from "@/context";
import Register from "../register";

jest.mock("@/context", () => ({
  useSession: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    navigate: jest.fn(),
  },
  Stack: {
    Screen: ({ children }: any) => children, // Mocked Screen component
  },
  useRouter: () => ({
    navigate: jest.fn(), // Mock navigation function
    replace: jest.fn(),
  }),
}));

jest.mock("expo-font", () => {
  const module: typeof import("expo-font") = {
    ...jest.requireActual("expo-font"),
    isLoaded: jest.fn(() => true),
  };

  return module;
});

describe("Register Component", () => {
  const mockRegister = jest.fn();
  const mockReplace = require("expo-router").router.replace;
  const mockNavigate = require("expo-router").router.navigate;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    (useSession as jest.Mock).mockReturnValue({
      register: mockRegister,
    });
  });

  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<Register />);
    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Already have an account? Login")).toBeTruthy();
  });

  it("handles input changes", () => {
    const { getByPlaceholderText } = render(<Register />);
    const usernameInput = getByPlaceholderText("Username");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(usernameInput, "testuser");
    fireEvent.changeText(passwordInput, "password123");

    expect(usernameInput.props.value).toBe("testuser");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("toggles password visibility", () => {
    const { getByPlaceholderText, getByTestId } = render(<Register />);
    const passwordInput = getByPlaceholderText("Password");
    const toggleButton = getByTestId("passwordSecureButton");

    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it("shows an error message if registration fails", async () => {
    mockRegister.mockRejectedValueOnce(new Error("Invalid credentials"));
    const { getByText, getByTestId, getByPlaceholderText } = render(
      <Register />
    );

    fireEvent.changeText(getByPlaceholderText("Username"), "testuser");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByTestId("registerButton"));

    await waitFor(() => {
      expect(getByText("Invalid credentials")).toBeTruthy();
    });
  });

  it("navigates to login screen when 'Login' is pressed", () => {
    const { getByText } = render(<Register />);
    fireEvent.press(getByText("Already have an account? Login"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("navigates to app on successful registration", async () => {
    const { getByTestId, getByPlaceholderText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText("Username"), "testuser");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByTestId("registerButton"));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
      expect(mockReplace).toHaveBeenCalledWith("/(app)/(tabs)");
    });
  });
});
