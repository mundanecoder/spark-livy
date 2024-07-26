import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../utils/jwt";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    (request as any).userId = decoded.userId;
  } catch (error) {
    reply.code(401).send({ error: "Authentication failed" });
  }
};
