import { FastifyInstance } from "fastify";
import {
  CreateListSchema,
  ParamsSchema,
  UpdateListSchema,
} from "@/handlers/lists/list.schema.js";
import {
  createListHandler,
  deleteListHandler,
  getListByIdHandler,
  getListsHandler,
  updateListHandler,
} from "@/handlers/lists/list.handler.js";

export async function listRoutes(app: FastifyInstance) {
  // Create a new list
  app.post(
    "/",
    {
      schema: {
        body: CreateListSchema,
      },
    },
    createListHandler,
  );

  // Get all lists
  app.get("/", getListsHandler);

  // Get a single list by ID
  app.get(
    "/:id",
    {
      schema: {
        params: ParamsSchema,
      },
    },
    getListByIdHandler,
  );

  // Update a list by ID
  app.put(
    "/:id",
    {
      schema: {
        body: UpdateListSchema,
        params: ParamsSchema,
      },
    },
    updateListHandler,
  );

  // Delete a list by ID
  app.delete(
    "/:id",
    {
      schema: {
        params: ParamsSchema,
      },
    },
    deleteListHandler,
  );
}
