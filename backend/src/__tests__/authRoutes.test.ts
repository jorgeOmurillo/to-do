import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import authRoutes from "../routes/authRoutes";
import User from "../models/User";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../models/User");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("should return 201 and tokens for valid credentials", async () => {
      const mockUser = {
        _id: "12345",
        username: "testuser",
        password: "hashedPassword",
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      (jwt.sign as jest.Mock).mockReturnValue("mockAccessToken");

      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "testuser", password: "password" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "User logged-in successfully!",
        accessToken: "mockAccessToken",
        refreshToken: "mockAccessToken",
      });
    });

    it("should return 400 for invalid credentials", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "testuser", password: "password" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });

  describe("POST /api/auth/register", () => {
    it("should return 201 and tokens for successful registration", async () => {
      const mockUser = {
        _id: "12345",
        username: "newuser",
        password: "hashedPassword",
      };
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (User.prototype.save as jest.Mock).mockResolvedValue(mockUser);

      (jwt.sign as jest.Mock).mockReturnValue("mockAccessToken");

      const response = await request(app)
        .post("/api/auth/register")
        .send({ username: "newuser", password: "password" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "User registered successfully!",
        accessToken: "mockAccessToken",
        refreshToken: "mockAccessToken",
      });
    });

    it("should return 400 for registration error", async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error("Hash error"));

      const response = await request(app)
        .post("/api/auth/register")
        .send({ username: "newuser", password: "password" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Error registering user");
    });
  });

  describe("POST /api/auth/refresh-token", () => {
    it("should return 200 and a new access token for a valid refresh token", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: "12345" });
      (jwt.sign as jest.Mock).mockReturnValue("newAccessToken");

      const response = await request(app)
        .post("/api/auth/refresh-token")
        .send({ refreshToken: "validRefreshToken" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ accessToken: "newAccessToken" });
    });

    it("should return 400 for an invalid refresh token", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app)
        .post("/api/auth/refresh-token")
        .send({ refreshToken: "invalidRefreshToken" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid or expired refresh token");
    });

    it("should return 401 if no refresh token is provided", async () => {
      const response = await request(app)
        .post("/api/auth/refresh-token")
        .send();

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Refresh token required");
    });
  });
});
