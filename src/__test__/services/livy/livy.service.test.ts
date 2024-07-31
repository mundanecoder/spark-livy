import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { LivyService } from "../../../services/livy/livy.service";
import {
  SubmitRequest,
  JobStatusResponse,
  SubmitResponseSchema,
  SubmitResponse,
  JobResultResponse,
} from "../../../types/submit.types";

// Mock axios and uuid modules
jest.mock("axios");
jest.mock("uuid");

describe("LivyService", () => {
  let livyService: LivyService;
  const mockLivyUrl = "http://mock-livy-url:8998";

  beforeEach(() => {
    livyService = new LivyService();
    (livyService as any).LIVY_URL = mockLivyUrl;
    (uuidv4 as jest.Mock).mockReturnValue("mock-uuid");

    // Mock console.error
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("submitJob", () => {
    it("should submit a job successfully", async () => {
      const jobDetails: SubmitRequest = {
        file: "test.py",
        className: "TestClass",
        args: ["arg1", "arg2"],
      };
      const expectedResponse: SubmitResponse = {
        id: "123",
        name: "spark1234",
        owner: "dummy",
        proxyUser: "dummy",
        state: "string",
        appId: "123appid",
        appInfo: {
          driverLogUrl: "",
          sparkUiUrl: "",
        },
        log: [],
      };

      // Mock Axios response
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: expectedResponse,
      });

      const result = await livyService.submitJob(jobDetails);

      expect(axios.post).toHaveBeenCalledWith(`${mockLivyUrl}/batches`, {
        ...jobDetails,
        name: "spark-job-mock-uuid",
      });
      expect(result).toEqual(expectedResponse);
    });

    it("should handle errors when submitting a job", async () => {
      const jobDetails: SubmitRequest = {
        file: "test.py",
        className: "TestClass",
        args: ["arg1", "arg2"],
      };
      const error = new Error("Livy error");
      (error as any).response = { data: "Error details" };

      // Mock Axios to throw error
      (axios.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(livyService.submitJob(jobDetails)).rejects.toThrow(
        "Livy error"
      );
      expect(console.error).toHaveBeenCalledWith("Error from Livy: Livy error");
      expect(console.error).toHaveBeenCalledWith(
        'Livy error details: "Error details"'
      );
    });
  });

  describe("getJobStatus", () => {
    it("should get job status successfully", async () => {
      const batchId = "123";
      const expectedResponse: JobStatusResponse = {
        id: "dummy-id",
        name: "dummy-name",
        owner: null,
        proxyUser: null,
        state: "dummy-state",
        appId: null,
        appInfo: {
          driverLogUrl: null,
          sparkUiUrl: null,
        },
        log: [],
      };

      // Mock Axios response
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: expectedResponse,
      });

      const result = await livyService.getJobStatus(batchId);

      expect(axios.get).toHaveBeenCalledWith(
        `${mockLivyUrl}/batches/${batchId}`
      );
      expect(result).toEqual(expectedResponse);
    });

    it("should handle errors when getting job status", async () => {
      const batchId = "123";
      const error = new Error("Livy error");
      (error as any).response = { data: "Error details" };

      // Mock Axios to throw error
      (axios.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(livyService.getJobStatus(batchId)).rejects.toThrow(
        "Livy error"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error getting status from Livy for batch 123: Livy error"
      );
      expect(console.error).toHaveBeenCalledWith(
        'Livy error details: "Error details"'
      );
    });
  });

  describe("getJobResult", () => {
    it("should get job result successfully", async () => {
      const batchId = "123";
      const expectedResponse: JobResultResponse = {
        id: "123",
        state: "success",
      };

      // Mock Axios response
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: expectedResponse,
      });

      const result = await livyService.getJobResult(batchId);

      expect(axios.get).toHaveBeenCalledWith(
        `${mockLivyUrl}/batches/${batchId}/state`
      );
      expect(result).toEqual(expectedResponse);
    });

    it("should handle errors when getting job result", async () => {
      const batchId = "123";
      const error = new Error("Livy error");
      (error as any).response = { data: "Error details" };

      // Mock Axios to throw error
      (axios.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(livyService.getJobResult(batchId)).rejects.toThrow(
        "Livy error"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error getting result from Livy for batch 123: Livy error"
      );
      expect(console.error).toHaveBeenCalledWith(
        'Livy error details: "Error details"'
      );
    });
  });
});
