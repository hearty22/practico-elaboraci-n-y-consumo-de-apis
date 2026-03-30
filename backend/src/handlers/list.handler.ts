import { FastifyReply, FastifyRequest } from 'fastify';
import ListModel from '@/models/list.model.js';
import { CreateListSchema, UpdateListSchema, ParamsSchema } from '@/models/list.schema.js';
import { z } from 'zod';

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
export async function createListHandler(request: CreateListRequest, reply: FastifyReply) {
  try {
    const list = await ListModel.create(request.body);
    return reply.code(201).send(list);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: 'Error creating list' });
  }
}

/**
 * @description Gets all lists
 * @param _
 * @param reply
 */
export async function getListsHandler(_: FastifyRequest, reply: FastifyReply) {
  try {
    const lists = await ListModel.find({});
    return reply.code(200).send(lists);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: 'Error fetching lists' });
  }
}

/**
 * @description Gets a single list by its ID
 * @param request
 * @param reply
 */
export async function getListByIdHandler(request: GetListByIdRequest, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const list = await ListModel.findById(id);
    if (!list) {
      return reply.code(404).send({ message: 'List not found' });
    }
    return reply.code(200).send(list);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: 'Error fetching list' });
  }
}

/**
 * @description Updates a list by its ID
 * @param request
 * @param reply
 */
export async function updateListHandler(request: UpdateListRequest, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const list = await ListModel.findByIdAndUpdate(id, request.body, {
      returnDocument: 'after', // Returns the modified document
    });

    if (!list) {
      return reply.code(404).send({ message: 'List not found' });
    }

    return reply.code(200).send(list);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: 'Error updating list' });
  }
}

/**
 * @description Deletes a list by its ID
 * @param request
 * @param reply
 */
export async function deleteListHandler(request: DeleteListRequest, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const list = await ListModel.findByIdAndDelete(id);

    if (!list) {
      return reply.code(404).send({ message: 'List not found' });
    }

    return reply.code(204).send(); // 204 No Content
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: 'Error deleting list' });
  }
}