import { FastifyReply, FastifyRequest } from "fastify";
import UserModel from "@/models/user.model.js";
import {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
} from "./auth.schema.js";
import { z } from "zod";
import { comparePass, hashPass } from "@/utils/hashPass.js";

/**
 *
 * @description Handles user registration
 * @param request
 * @param reply
 *
 */

export const RegisterHandler = async (
  request: FastifyRequest<{ Body: z.infer<typeof RegisterSchema> }>,
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
  request: FastifyRequest<{ Body: z.infer<typeof LoginSchema> }>,
  reply: FastifyReply,
) => {
  try {
    const { email, password } = request.body;
    const user = await UserModel.findOne({
      email: email,
    });
    if (!user)
      return reply.code(401).send({
        msg: "invalid credentials",
        ok: false,
      });

    const hashedPass = user.password;
    const passMatch = await comparePass(password, hashedPass);
    if (!passMatch) {
      return reply.code(401).send({
        msg: "invalid credentials",
        ok: false,
      });
    }
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const token = await reply.jwtSign(payload);
    reply.cookie("token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENVIROMENT === "production",
      sameSite: "none",
    });
    return reply.code(200).send({ msg: "login success", ok: true });
  } catch (e) {
    return reply.code(500).send({ msg: "Error logging in", ok: false });
  }
};
export const LogoutHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    reply.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENVIROMENT === "production",
      sameSite: "none",
    });
    return reply.code(200).send({ msg: "logout success", ok: true });
  } catch (error) {
    return reply.code(500).send({
      msg: "Error logging out",
      ok: false,
    });
  }
};
export const UpdateProfileHandler = async (
  request: FastifyRequest<{ Body: z.infer<typeof UpdateProfileSchema> }>,
  reply: FastifyReply,
) => {
  try {
    const userId = request.user.id;
    const { email, username, password } = request.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return reply.code(404).send({
        msg: "User not found",
        ok: false,
      });
    }
    if (password) {
      const hashedPassword = await hashPass(password);
      user.password = hashedPassword;
    }
    if (email) {
      user.email = email;
    }
    if (username) {
      user.username = username;
    }
    await user.save();
    return reply.code(200).send({
      msg: "User updated succesfully",
      ok: true,
      data: {
        user: user,
      },
    });
  } catch (error) {
    return reply.code(500).send({
      msg: "Error updating user",
      ok: false,
    });
  }
};
