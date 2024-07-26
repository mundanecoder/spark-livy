declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: "development" | "production" | "test";
    MONGO_URL?: string;
    JWT_SECRET: string;
    LIVY_URL: string;
  }
}
