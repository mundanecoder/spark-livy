import { FastifyInstance } from "fastify";
import { AuthController } from "../controller/auth/auth.controller";
import { authenticate } from "../middleware/auth";

export default async function (fastify: FastifyInstance) {
  const authController = new AuthController();

  fastify.post("/register", authController.register);
  fastify.post("/login", authController.login);

  fastify.get(
    "/profile",
    { preHandler: authenticate },
    authController.getProfile
  );
}
