import request from "supertest";
import { initializeApp } from "../server";

const app = initializeApp();

describe("GET /health", () => {
  it("should return 200 with a success message", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Backend is running!");
  });
});
