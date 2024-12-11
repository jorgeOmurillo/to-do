import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { initializeApp, connectDatabase } from "../server";

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

describe("GET /api/debug/protected", () => {
  const app = initializeApp();

  it("should return a 401 for unauthenticated requests", async () => {
    const response = await request(app).get("/api/debug/protected");
    expect(response.status).toBe(401);
  });
});
