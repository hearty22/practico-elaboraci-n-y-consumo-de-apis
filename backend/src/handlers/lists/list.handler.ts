import { FastifyReply, FastifyRequest } from "fastify";
import ListModel from "@/models/list.model.js";
import {
  CreateListSchema,
  UpdateListSchema,
  ParamsSchema,
} from "@/handlers/lists/list.schema.js";
import { z } from "zod";

type CreateListRequest = FastifyRequest<{
  Body: z.infer<typeof CreateListSchema>;
}>;

type GetListByIdRequest = FastifyRequest<{
  Params: z.infer<typeof ParamsSchema>;
}>;

type UpdateListRequest = FastifyRequest<{
  Body: z.infer<typeof UpdateListSchema>;
  Params: z.infer<typeof ParamsSchema>;
}>;

type DeleteListRequest = FastifyRequest<{
  Params: z.infer<typeof ParamsSchema>;
}>;

/**
 * @description Creates a new list
 * @param request
 * @param reply
 */
export const createListHandler = async (
  request: CreateListRequest,
  reply: FastifyReply,
) => {
  try {
    const list = await ListModel.create(request.body);
    return reply.code(201).send({
      msg: "list created successfully",
      ok: true,
      data: {
        list: list,
      },
    });
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ msg: "Error creating list", ok: false });
  }
};

/**
 * @description Gets all lists
 * @param _
 * @param reply
 */
export const getListsHandler = async (
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const lists = await ListModel.find({});
    return reply.code(200).send({
      msg: "lists fetched successfully",
      ok: true,
      data: {
        lists: lists,
      },
    });
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ msg: "Error fetching lists", ok: false });
  }
};

/**
 * @description Gets a single list by its ID
 * @param request
 * @param reply
 */
export const getListByIdHandler = async (
  request: GetListByIdRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const list = await ListModel.findById(id);
    if (!list) {
      return reply.code(404).send({ msg: "List not found", ok: false });
    }
    return reply.code(200).send({
      msg: "list fetched successfully",
      ok: true,
      data: {
        list: list,
      },
    });
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ msg: "Error fetching list", ok: false });
  }
};

/**
 * @description Updates a list by its ID
 * @param request
 * @param reply
 */
export const updateListHandler = async (
  request: UpdateListRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const list = await ListModel.findByIdAndUpdate(id, request.body, {
      returnDocument: "after", // Returns the modified document
    });

    if (!list) {
      return reply.code(404).send({ msg: "List not found", ok: false });
    }

    return reply.code(200).send({
      msg: "list updated successfully",
      ok: true,
      data: {
        list: list,
      },
    });
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ msg: "Error updating list", ok: false });
  }
};

/**
 * @description Deletes a list by its ID
 * @param request
 * @param reply
 */
export const deleteListHandler = async (
  request: DeleteListRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const list = await ListModel.findByIdAndDelete(id);

    if (!list) {
      return reply.code(404).send({ msg: "List not found", ok: false });
    }

    return reply.code(204).send(); // 204 No Content
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ msg: "Error deleting list", ok: false });
  }
};
