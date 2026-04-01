import { FastifyReply, FastifyRequest } from "fastify";

const isAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // This single line does all the work:
    // 1. Finds the token from the cookie (as configured in index.ts).
    // 2. Verifies the token's signature and expiration.
    // 3. If valid, it decorates the request object with `request.user` containing the payload.
    await request.jwtVerify();
  } catch (error) {
    // If jwtVerify fails, it throws an error. We catch it and send a proper 401 response.
    return reply.code(401).send({ msg: "Authentication required", ok: false });
  }
};

export default isAuth;
