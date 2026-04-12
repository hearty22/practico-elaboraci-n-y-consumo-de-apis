import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";
import { dbConnect } from "@/config/database.js";
import { listRoutes } from "@/handlers/lists/list.routes.js";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { fileURLToPath } from "url";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { authRoutes } from "@/handlers/auth/auth.routes.js";

const PORT: number = Number(process.env.PORT) || 3000;

export async function build(opts = {}): Promise<FastifyInstance> {
  const fastify = Fastify(opts).withTypeProvider<ZodTypeProvider>();
  fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  });
  fastify.register(fastifyCookie);
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "supersecret", // Usar un valor por defecto para tests
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // CAMBIO 2: Conectar a la base de datos aquí, al construir la app.
  await dbConnect();

  fastify.get("/", async () => {
    return { status: "ok" };
  });

  // Register the routes
  fastify.register(listRoutes, { prefix: "/api/lists" });
  fastify.register(authRoutes, { prefix: "/api/auth" });

  return fastify;
}

async function start() {
  const fastify = await build({
    logger: {
      level: "info",
    },
  });

  try {
    // CAMBIO 3: La conexión ya no se hace aquí.
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// This block will only run if the file is executed directly
if (import.meta.url.startsWith("file://")) {
  const modulePath = fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    start();
  }
}
