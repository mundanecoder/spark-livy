import { FastifyInstance } from "fastify";

export type FastifyPlugin = (
  fastify: FastifyInstance,
  opts: any,
  next: (err?: Error) => void
) => void;

export async function registerPlugins(
  fastify: FastifyInstance,
  plugins: Array<{ plugin: FastifyPlugin; options?: any }>
) {
  plugins.forEach(async ({ plugin, options }) => {
    await fastify.register(plugin, options);
  });
}
