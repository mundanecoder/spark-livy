import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import connectToDb from "./database/db";

import * as dotenv from "dotenv";
import { autoLoadPlugin } from "./plugin/autoload";
import { join } from "path";
import { registerPlugins } from "./utils/plugginMapper";
import { fastifyCors } from "@fastify/cors";
import { Server } from "http";
dotenv.config();

const server: FastifyInstance = fastify({ logger: true });
server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST"],
});

const plugins = [
  {
    plugin: autoLoadPlugin,
    options: {
      dir: join(__dirname, "./routes"),
    },
  },
];

connectToDb();
registerPlugins(server, plugins);

server.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  return { hello: "world" };
});

const startServer = async () => {
  try {
    server.listen({ port: 5000, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
      server.log.info(`Server listening on ${address}`);
    });
  } catch (error) {
    server.log.error(`Error starting server: ${error}`);
    process.exit(1);
  }
};

startServer();
