import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useSession } from "@/context";
import { router } from "expo-router";
import Login from "../login";

jest.mock("@/context", () => ({
  useSession: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
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

describe("Login Component", () => {
  const mockLogIn = jest.fn();

  beforeEach(() => {
    console.error = jest.fn();
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      logIn: mockLogIn,
    });
  });

  it("renders login screen correctly", () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Don't have an account? Register")).toBeTruthy();
  });

  it("handles input changes", () => {
    const { getByPlaceholderText } = render(<Login />);

    const usernameInput = getByPlaceholderText("Username");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(usernameInput, "some-user");
    fireEvent.changeText(passwordInput, "password123");

    expect(usernameInput.props.value).toBe("some-user");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("toggles password visibility", () => {
    const { getByPlaceholderText, getByTestId } = render(<Login />);

    const passwordInput = getByPlaceholderText("Password");
    const toggleButton = getByTestId("passwordSecureButton");

    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it("logs in successfully and navigates", async () => {
    mockLogIn.mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByTestId } = render(<Login />);

    const usernameInput = getByPlaceholderText("Username");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByTestId("loginButton");

    fireEvent.changeText(usernameInput, "some-user");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogIn).toHaveBeenCalledWith({
        username: "some-user",
        password: "password123",
      });
      expect(router.replace).toHaveBeenCalledWith("/(app)/(tabs)");
    });
  });

  it("displays error message on login failure", async () => {
    mockLogIn.mockRejectedValueOnce(new Error("Invalid credentials"));

    const { getByPlaceholderText, getByTestId, findByText } = render(<Login />);

    const usernameInput = getByPlaceholderText("Username");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByTestId("loginButton");

    fireEvent.changeText(usernameInput, "some-user");
    fireEvent.changeText(passwordInput, "wrongpassword");
    fireEvent.press(loginButton);

    const errorMessage = await findByText("Invalid credentials");

    expect(errorMessage).toBeTruthy();
    expect(mockLogIn).toHaveBeenCalledWith({
      username: "some-user",
      password: "wrongpassword",
    });
  });

  it("navigates to register screen", () => {
    const { getByText } = render(<Login />);

    const registerLink = getByText("Don't have an account? Register");
    fireEvent.press(registerLink);

    expect(router.navigate).toHaveBeenCalledWith("/register");
  });
});
