// services/livy/livy.service.ts
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  SubmitRequest,
  JobStatusResponse,
  JobResultResponse,
} from "../../types/submit.types";

export class LivyService {
  private LIVY_URL: string;

  constructor() {
    this.LIVY_URL = process.env.LIVY_URL || "http://16.171.237.145:8998";
  }

  async submitJob(jobDetails: SubmitRequest): Promise<any> {
    const name = `spark-job-${uuidv4()}`;

    try {
      const response = await axios.post(`${this.LIVY_URL}/batches`, {
        ...jobDetails,
        name,
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error from Livy: ${error.message}`);
      if (error.response) {
        console.error(
          `Livy error details: ${JSON.stringify(error.response.data)}`
        );
      }
      throw error;
    }
  }

  async getJobStatus(batchId: string): Promise<JobStatusResponse> {
    try {
      const response = await axios.get(`${this.LIVY_URL}/batches/${batchId}`);
      return response.data;
    } catch (error: any) {
      console.error(
        `Error getting status from Livy for batch ${batchId}: ${error.message}`
      );
      if (error.response) {
        console.error(
          `Livy error details: ${JSON.stringify(error.response.data)}`
        );
      }
      throw error;
    }
  }

  async getJobResult(batchId: string): Promise<JobResultResponse> {
    try {
      const response = await axios.get(
        `${this.LIVY_URL}/batches/${batchId}/state`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        `Error getting result from Livy for batch ${batchId}: ${error.message}`
      );
      if (error.response) {
        console.error(
          `Livy error details: ${JSON.stringify(error.response.data)}`
        );
      }
      throw error;
    }
  }
}
