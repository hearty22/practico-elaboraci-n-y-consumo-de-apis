// Import the original module type
import "@fastify/jwt";

// Augment the module declaration
declare module "@fastify/jwt" {
  // Re-define the interface for the JWT payload
  interface FastifyJWT {
    // This is the shape of the object that will be available on `request.user`
    user: {
      id: string;
      email: string;
      username: string;
    };
  }
}
