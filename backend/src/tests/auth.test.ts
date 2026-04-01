import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { build } from "@/index.js";
import supertest from "supertest";
import UserModel from "@/models/user.model.js";
import { FastifyInstance } from "fastify";

describe("Auth Routes", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await build();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await UserModel.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const response = await supertest(app.server)
        .post("/api/auth/register")
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.ok).toBe(true);
      expect(response.body.msg).toBe("User created succesfully");

      // Verify user was actually created in the database
      const dbUser = await UserModel.findOne({ email: newUser.email });
      expect(dbUser).not.toBeNull();
      expect(dbUser?.username).toBe(newUser.username);
    });

    it("should fail to register a user with an existing email", async () => {
      // First, create a user
      const existingUser = {
        username: "existinguser",
        email: "existing@example.com",
        password: "password123",
      };
      await supertest(app.server).post("/api/auth/register").send(existingUser);

      // Then, try to register again with the same email
      const response = await supertest(app.server)
        .post("/api/auth/register")
        .send({
          username: "anotheruser",
          email: "existing@example.com", // Same email
          password: "anotherpassword",
        });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe("Email already exists");
    });
  });
});
