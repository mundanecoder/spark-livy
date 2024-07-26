import { FastifyRequest, FastifyReply } from "fastify";
import { loginUser } from "../../services/auth/login.service";
import { registerUser } from "../../services/auth/signup.service";

interface RegisterRequest {
  username: string;
  password: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

export class AuthController {
  async register(
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { username, password } = request.body;
      const { user, token } = await registerUser(username, password);
      reply.code(201).send({
        message: "User registered successfully",
        userId: user._id,
        // token,
      });
    } catch (error) {
      reply.code(400).send({ error: "Registration failed", message: error });
    }
  }

  async login(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { username, password } = request.body;
      const { user, token } = await loginUser(username, password);
      reply.send({ message: "Login successful", userId: user._id, token });
    } catch (error) {
      reply.code(401).send({ error: "Invalid credentials" });
    }
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).userId;
    reply.send({ userId, message: "Profile fetched successfully" });
  }
}
