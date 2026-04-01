import { FastifyReply, FastifyRequest } from "fastify";
import UserModel from "@/models/user.model.js";
import {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
} from "./auth.schema.js";
import { z } from "zod";
import { comparePass, hashPass } from "@/utils/hashPass.js";

type RegisterRequest = FastifyRequest<{
  Body: z.infer<typeof RegisterSchema>;
}>;
type LoginRequest = FastifyRequest<{
  Body: z.infer<typeof LoginSchema>;
}>;
type UpdateProfileRequest = FastifyRequest<{
  Body: z.infer<typeof UpdateProfileSchema>;
}>;

/**
 *
 * @description Handles user registration
 * @param request
 * @param reply
 *
 */

export const RegisterHandler = async (
  request: RegisterRequest,
  reply: FastifyReply,
) => {
  try {
    // validation if the user exist

    const { email, username, password } = request.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return reply.code(400).send({ msg: "Email already exists", ok: false });
    }
    const hashedPassword = await hashPass(password);
    const user = await UserModel.create({
      email: email,
      username: username,
      password: hashedPassword,
    });
    return reply.code(201).send({
      msg: "User created succesfully",
      ok: true,
      data: {
        user: user,
      },
    });
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ msg: "Error registering user", ok: false });
  }
};

/****
 *
 * @description Handles user login
 * @param request
 * @param reply
 */
export const LoginHandler = async (
  request: LoginRequest,
  reply: FastifyReply,
) => {
  try {
    const { email, password } = request.body;
    const user = await UserModel.find({
      email: email,
    });
    if (!user) {
      return reply.code(401).send({
        msg: "invalid credentials",
        ok: false,
      });
    }
    const hashedPass = user.password;
    const passMatch = await comparePass(password, hashedPass);
    if (!passMatch) {
      return reply.code(401).send({
        msg: "invalid credentials",
        ok: false,
      });
    }
  } catch (e) {}
};
