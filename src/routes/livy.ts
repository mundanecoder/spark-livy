import { FastifyInstance } from "fastify";
import { JobController } from "../controller/livy/job.controller";
import { LivyService } from "../services/livy/livy.service";
import { authenticate } from "../middleware/auth";

export default async function (fastify: FastifyInstance) {
  const livyService = new LivyService();
  const jobController = new JobController(livyService);

  fastify.post("/submit", {
    ...jobController.submitJobOpts,
    preHandler: authenticate,
    handler: jobController.submitJob,
  });

  fastify.get("/status/:batch_id", {
    ...jobController.getJobStatusOpts,
    preHandler: authenticate,
    handler: jobController.getJobStatus,
  });

  fastify.get("/result/:batch_id", {
    ...jobController.getJobResultOpts,
    preHandler: authenticate,
    handler: jobController.getJobResult,
  });
}
