import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { FastifyInstance } from "fastify";
import supertest from "supertest";
import { build } from "@/index.js";
import ListModel from "@/models/list.model.js";
import mongoose from "mongoose";
describe("/api/lists", () => {
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
    await ListModel.deleteMany({});
  });

  it("POST /api/lists - should create a new task and return 201", async () => {
    const taskPayload = {
      title: "My Test Task",
      description: "A detailed description for the test task.",
    };

    const response = await supertest(app.server)
      .post("/api/lists")
      .send(taskPayload);

    expect(response.status).toBe(201);
    // Adjust assertion to match the nested response structure
    expect(response.body.data.list.title).toBe(taskPayload.title);
    expect(response.body.data.list.description).toBe(taskPayload.description);
    expect(response.body.data.list.is_complete).toBe(false); // Should default to false
    expect(response.body.data.list).toHaveProperty("_id");

    const taskInDb = await ListModel.findById(response.body.data.list._id);
    expect(taskInDb).not.toBeNull();
    expect(taskInDb?.title).toBe(taskPayload.title);
  });

  it("GET /api/lists - should return all tasks", async () => {
    await ListModel.create({ title: "First Task" });
    await ListModel.create({
      title: "Second Task",
      description: "With description",
    });

    const response = await supertest(app.server).get("/api/lists");

    expect(response.status).toBe(200);
    // Adjust assertion to check the nested array
    expect(response.body.data.lists).toBeInstanceOf(Array);
    expect(response.body.data.lists.length).toBe(2);
  });

  it("GET /api/lists/:id - should return a single task if found", async () => {
    const newTask = await ListModel.create({ title: "A single task" });
    const taskId = newTask._id.toString();

    const response = await supertest(app.server).get(`/api/lists/${taskId}`);

    expect(response.status).toBe(200);
    // Adjust assertion to match the nested response structure
    expect(response.body.data.list._id).toBe(taskId);
    expect(response.body.data.list.title).toBe("A single task");
  });

  it("GET /api/lists/:id - should return 404 if task not found", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const response = await supertest(app.server).get(
      `/api/lists/${nonExistentId}`,
    );
    expect(response.status).toBe(404);
  });

  it("PUT /api/lists/:id - should update a task and return 200", async () => {
    const newTask = await ListModel.create({ title: "Original Title" });
    const taskId = newTask._id.toString();
    const updatePayload = {
      title: "Updated Title",
      description: "Updated description",
      is_complete: true,
    };

    const response = await supertest(app.server)
      .put(`/api/lists/${taskId}`)
      .send(updatePayload);

    expect(response.status).toBe(200);
    // Adjust assertion to match the nested response structure
    expect(response.body.data.list.title).toBe(updatePayload.title);
    expect(response.body.data.list.description).toBe(updatePayload.description);
    expect(response.body.data.list.is_complete).toBe(updatePayload.is_complete);

    const taskInDb = await ListModel.findById(taskId);
    expect(taskInDb?.title).toBe(updatePayload.title);
    expect(taskInDb?.is_complete).toBe(true);
  });

  it("DELETE /api/lists/:id - should delete a task and return 204", async () => {
    const newTask = await ListModel.create({ title: "To be deleted" });
    const taskId = newTask._id.toString();

    const response = await supertest(app.server).delete(`/api/lists/${taskId}`);

    expect(response.status).toBe(204);

    const taskInDb = await ListModel.findById(taskId);
    expect(taskInDb).toBeNull();
  });
});
