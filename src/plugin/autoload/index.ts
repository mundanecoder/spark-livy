import { FastifyInstance, FastifyPluginOptions } from "fastify";
import autoLoad from "@fastify/autoload";

interface AutoLoadPluginOptions extends FastifyPluginOptions {
  dir: string;
}

export function autoLoadPlugin(
  fastify: FastifyInstance,
  opts: AutoLoadPluginOptions,
  next: (err?: Error) => void
) {
  const { dir } = opts;

  fastify.register(autoLoad, {
    dir,
    options: { prefix: "/api/v1" },
  });

  next();
}
