import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { initializeApp, connectDatabase } from "../server";
import jwt from "jsonwebtoken";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  process.env.MONGO_URI = uri;

  await connectDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const app = initializeApp();

describe("GET /api/debug/protected", () => {
  let validToken: string;
  const secret = process.env.JWT_SECRET || "test_secret";

  beforeAll(() => {
    // Generate a valid token
    validToken = jwt.sign({ userId: "testUser" }, secret, { expiresIn: "1h" });
  });

  it("should return 200 with a success message and user data when the token is valid", async () => {
    const response = await request(app)
      .get("/api/debug/protected")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "This is a protected route!",
      user: expect.objectContaining({ userId: "testUser" }),
    });
  });

  it("should return 401 when no token is provided", async () => {
    const response = await request(app).get("/api/debug/protected");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "No token provided" });
  });

  it("should return 401 when the token is invalid", async () => {
    const response = await request(app)
      .get("/api/debug/protected")
      .set("Authorization", "Bearer invalidToken");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid token" });
  });

  it("should return 401 when the token is expired", async () => {
    const expiredToken = jwt.sign(
      { userId: "testUser" },
      secret,
      { expiresIn: "-1h" } // Expired token
    );

    const response = await request(app)
      .get("/api/debug/protected")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid token" });
  });
});
