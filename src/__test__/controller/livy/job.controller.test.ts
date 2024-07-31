import { FastifyRequest, FastifyReply } from "fastify";
import { JobController } from "../../../controller/livy/job.controller";
import { LivyService } from "../../../services/livy/livy.service";
import {
  SubmitRequest,
  JobParams,
  SubmitResponse,
  JobStatusResponse,
  JobResultResponse,
} from "../../../types/submit.types";

jest.mock("../../../services/livy/livy.service");

describe("JobController", () => {
  let jobController: JobController;
  let mockLivyService: jest.Mocked<LivyService>;

  beforeEach(() => {
    // Create a mocked instance of LivyService
    mockLivyService = new LivyService() as jest.Mocked<LivyService>;
    jobController = new JobController(mockLivyService);
  });

  describe("submitJob", () => {
    it("should submit a job successfully", async () => {
      // Arrange
      const mockRequest = {
        body: {
          file: "test.py",
          className: "TestClass",
          args: ["arg1", "arg2"],
        } as SubmitRequest,
        log: {
          error: jest.fn(),
        },
      } as unknown as FastifyRequest<{ Body: SubmitRequest }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const expectedResponse: SubmitResponse = {
        id: "123",
        state: "success",
        name: "Test Job",
        owner: "John Doe",
        proxyUser: null,
        appId: "application_123",
        appInfo: {
          driverLogUrl: "http://localhost:4040/driver",
          sparkUiUrl: "http://localhost:4040/spark",
        },
        log: ["Log message 1", "Log message 2"],
      };

      mockLivyService.submitJob.mockResolvedValue(expectedResponse);

      // Act
      await jobController.submitJob(mockRequest, mockResponse);

      // Assert
      expect(mockLivyService.submitJob).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse);
    });

    it("should handle errors when submitting a job", async () => {
      // Arrange
      const mockRequest = {
        body: {
          file: "test.py",
          className: "TestClass",
          args: ["arg1", "arg2"],
        } as SubmitRequest,
        log: {
          error: jest.fn(),
        },
      } as unknown as FastifyRequest<{ Body: SubmitRequest }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const error = new Error("Livy error");
      (error as any).response = { data: "Error details" };

      mockLivyService.submitJob.mockRejectedValue(error);

      // Act
      await jobController.submitJob(mockRequest, mockResponse);

      // Assert
      expect(mockRequest.log.error).toHaveBeenCalledWith(
        `Error submitting job: ${error.message}`
      );
      expect(mockRequest.log.error).toHaveBeenCalledWith(
        `Livy error details: ${JSON.stringify(
          (error as any).response?.data || "Unknown"
        )}`
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "Failed to submit job",
        error: error.message,
      });
    });

    it("should return 400 if no file is provided", async () => {
      // Arrange
      const mockRequest = {
        body: {
          file: "",
          className: "TestClass",
          args: ["arg1", "arg2"],
        } as SubmitRequest,
        log: {
          error: jest.fn(),
        },
      } as unknown as FastifyRequest<{ Body: SubmitRequest }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      // Act
      await jobController.submitJob(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "No file provided",
      });
    });
  });

  describe("getJobStatus", () => {
    it("should get job status successfully", async () => {
      // Arrange
      const batchId = "123";
      const mockRequest = {
        params: { batch_id: batchId } as JobParams,
        log: {
          error: jest.fn(),
        },
      } as unknown as FastifyRequest<{ Params: JobParams }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const expectedResponse: JobStatusResponse = {
        id: "123",
        name: "Test Job",
        owner: "John Doe",
        proxyUser: null,
        state: "success",
        appId: "application_123",
        appInfo: {
          driverLogUrl: "http://localhost:4040/driver",
          sparkUiUrl: "http://localhost:4040/spark",
        },
        log: ["Log message 1", "Log message 2"],
      };

      mockLivyService.getJobStatus.mockResolvedValue(expectedResponse);

      // Act
      await jobController.getJobStatus(mockRequest, mockResponse);

      // Assert
      expect(mockLivyService.getJobStatus).toHaveBeenCalledWith(batchId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse);
    });

    it("should handle errors when getting job status", async () => {
      // Arrange
      const batchId = "123";
      const mockRequest = {
        params: { batch_id: batchId } as JobParams,
        log: {
          error: jest.fn(),
        },
      } as unknown as FastifyRequest<{ Params: JobParams }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const error = new Error("Livy error");
      mockLivyService.getJobStatus.mockRejectedValue(error);

      // Act
      await jobController.getJobStatus(mockRequest, mockResponse);

      // Assert
      expect(mockRequest.log.error).toHaveBeenCalledWith(
        `Error getting status for batch ${batchId}: ${error.message}`
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "Failed to get job status",
        error: error.message,
      });
    });
  });

  describe("getJobResult", () => {
    it("should get job result successfully", async () => {
      // Arrange
      const batchId = "123";
      const mockRequest = {
        params: { batch_id: batchId } as JobParams,
        log: {
          error: jest.fn(),
        },
      } as unknown as FastifyRequest<{ Params: JobParams }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const expectedResponse: JobResultResponse = {
        id: "123",
        state: "success",
      };

      mockLivyService.getJobResult.mockResolvedValue(expectedResponse);

      // Act
      await jobController.getJobResult(mockRequest, mockResponse);

      // Assert
      expect(mockLivyService.getJobResult).toHaveBeenCalledWith(batchId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse);
    });

    it("should handle errors when getting job result", async () => {
      // Arrange
      const batchId = "123";
      const mockRequest = {
        params: { batch_id: batchId } as JobParams,
        log: {
          error: jest.fn(),
        },
      } as unknown as FastifyRequest<{ Params: JobParams }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const error = new Error("Livy error");
      mockLivyService.getJobResult.mockRejectedValue(error);

      // Act
      await jobController.getJobResult(mockRequest, mockResponse);

      // Assert
      expect(mockRequest.log.error).toHaveBeenCalledWith(
        `Error getting result for batch ${batchId}: ${error.message}`
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "Failed to get job result",
        error: error.message,
      });
    });
  });
});
