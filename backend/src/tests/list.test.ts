import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { build } from '@/index.js';
import ListModel from '@/models/list.model.js';

describe('/api/lists', () => {
  let app: FastifyInstance;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    app = build();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clean up the database before each test
    await ListModel.deleteMany({});
  });

  it('POST /api/lists - should create a new list and return 201', async () => {
    const listTitle = 'My Test List';

    const response = await supertest(app.server)
      .post('/api/lists')
      .send({ title: listTitle });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(listTitle);
    expect(response.body).toHaveProperty('_id');

    const listInDb = await ListModel.findById(response.body._id);
    expect(listInDb).not.toBeNull();
  });

  it('GET /api/lists - should return all lists', async () => {
    await ListModel.create({ title: 'First List' });
    await ListModel.create({ title: 'Second List' });

    const response = await supertest(app.server).get('/api/lists');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);
  });

  it('GET /api/lists/:id - should return a single list if found', async () => {
    const newList = await ListModel.create({ title: 'A single list' });
    const listId = newList._id.toString();

    const response = await supertest(app.server).get(`/api/lists/${listId}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(listId);
    expect(response.body.title).toBe('A single list');
  });

  it('GET /api/lists/:id - should return 404 if list not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const response = await supertest(app.server).get(`/api/lists/${nonExistentId}`);
    expect(response.status).toBe(404);
  });

  it('PUT /api/lists/:id - should update a list and return 200', async () => {
    const newList = await ListModel.create({ title: 'Original Title' });
    const listId = newList._id.toString();
    const updatedTitle = 'Updated Title';

    const response = await supertest(app.server)
      .put(`/api/lists/${listId}`)
      .send({ title: updatedTitle });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedTitle);

    const listInDb = await ListModel.findById(listId);
    expect(listInDb?.title).toBe(updatedTitle);
  });

  it('DELETE /api/lists/:id - should delete a list and return 204', async () => {
    const newList = await ListModel.create({ title: 'To be deleted' });
    const listId = newList._id.toString();

    const response = await supertest(app.server).delete(`/api/lists/${listId}`);

    expect(response.status).toBe(204);

    const listInDb = await ListModel.findById(listId);
    expect(listInDb).toBeNull();
  });
});