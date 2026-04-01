import { FastifyInstance } from "fastify";
import {
  RegisterHandler,
  LoginHandler,
  LogoutHandler,
  UpdateProfileHandler,
} from "./auth.handler.js";
import {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
} from "./auth.schema.js";
import isAuth from "@/utils/auth.hook.js";

// Wrap the entire function in fp() to prevent encapsulation
export const authRoutes = async function (app: FastifyInstance) {
  app.post(
    "/register",
    {
      schema: {
        body: RegisterSchema,
      },
    },
    RegisterHandler,
  );

  app.post(
    "/login",
    {
      schema: {
        body: LoginSchema,
      },
    },
    LoginHandler,
  );

  app.post(
    "/logout",
    {
      preHandler: isAuth,
    },
    LogoutHandler,
  );

  app.put(
    "/update",
    {
      schema: {
        body: UpdateProfileSchema,
      },
      preHandler: isAuth,
    },
    // @ts-ignore - Temporarily ignoring this due to a persistent type inference issue.
    // We will come back to this after writing tests.
    UpdateProfileHandler,
  );
};
