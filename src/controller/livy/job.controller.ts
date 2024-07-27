import { FastifyRequest, FastifyReply, RouteShorthandOptions } from "fastify";
import {
  SubmitRequest,
  SubmitRequestSchema,
  JobParams,
  JobParamsSchema,
  JobStatusResponseSchema,
  JobResultResponseSchema,
  ErrorResponseSchema,
  SubmitResponseSchema,
} from "../../types/submit.types";
import { LivyService } from "../../services/livy/livyservice";

export class JobController {
  constructor(private livyService: LivyService) {}

  submitJobOpts: RouteShorthandOptions = {
    schema: {
      body: SubmitRequestSchema,
      response: {
        201: SubmitResponseSchema,
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
  };

  getJobStatusOpts: RouteShorthandOptions = {
    schema: {
      params: JobParamsSchema,
      response: {
        200: JobStatusResponseSchema,
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
  };

  getJobResultOpts: RouteShorthandOptions = {
    schema: {
      params: JobParamsSchema,
      response: {
        200: JobResultResponseSchema,
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
  };

  submitJob = async (
    request: FastifyRequest<{ Body: SubmitRequest }>,
    reply: FastifyReply
  ) => {
    const jobDetails = request.body;

    if (!jobDetails.file) {
      reply.status(400).send({ message: "No file provided" });
      return;
    }

    try {
      const response = await this.livyService.submitJob(jobDetails);

      console.log(response);
      return reply.status(201).send(response);
    } catch (error: any) {
      request.log.error(`Error submitting job: ${error.message}`);
      if (error.response) {
        request.log.error(
          `Livy error details: ${JSON.stringify(error.response.data)}`
        );
      }
      reply
        .status(500)
        .send({ message: "Failed to submit job", error: error.message });
    }
  };

  getJobStatus = async (
    request: FastifyRequest<{ Params: JobParams }>,
    reply: FastifyReply
  ) => {
    const { batch_id } = request.params;

    try {
      const response = await this.livyService.getJobStatus(batch_id);
      if (!response || Object.keys(response).length === 0) {
        throw new Error("Empty response from Livy service");
      }
      reply.status(200).send(response);
    } catch (error: any) {
      request.log.error(
        `Error getting status for batch ${batch_id}: ${error.message}`
      );
      reply
        .status(500)
        .send({ message: "Failed to get job status", error: error.message });
    }
  };

  getJobResult = async (
    request: FastifyRequest<{ Params: JobParams }>,
    reply: FastifyReply
  ) => {
    const { batch_id } = request.params;

    try {
      const response = await this.livyService.getJobResult(batch_id);
      if (!response || Object.keys(response).length === 0) {
        throw new Error("Empty response from Livy service");
      }
      reply.status(200).send(response);
    } catch (error: any) {
      request.log.error(
        `Error getting result for batch ${batch_id}: ${error.message}`
      );
      reply
        .status(500)
        .send({ message: "Failed to get job result", error: error.message });
    }
  };
}
