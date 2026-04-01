import Fastify, { FastifyInstance } from "fastify";
import "dotenv/config";
import { dbConnect } from "@/config/database.js";
import { listRoutes } from "@/handlers/lists/list.routes.js";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { fileURLToPath } from "url";

const PORT: number = Number(process.env.PORT) || 3000;

export function build(opts = {}): FastifyInstance {
  const fastify = Fastify(opts).withTypeProvider<ZodTypeProvider>();

  // Set the validator and serializer compilers from the type provider
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.get("/", async () => {
    return { status: "ok" };
  });

  // Register the routes for the 'list' resource
  fastify.register(listRoutes, { prefix: "/api/lists" });

  return fastify;
}

async function start() {
  const fastify = build({
    logger: {
      level: "info",
    },
  });

  try {
    await dbConnect();
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
