// schemas/submit.schema.ts
import { Static, Type } from "@sinclair/typebox";

export const SubmitRequestSchema = Type.Object({
  file: Type.String(),
  className: Type.Optional(Type.String()),
  args: Type.Optional(Type.Array(Type.String())),
  jars: Type.Optional(Type.Array(Type.String())),
  pyFiles: Type.Optional(Type.Array(Type.String())),
  files: Type.Optional(Type.Array(Type.String())),
  driverMemory: Type.Optional(Type.String()),
  driverCores: Type.Optional(Type.Number()),
  executorMemory: Type.Optional(Type.String()),
  executorCores: Type.Optional(Type.Number()),
  numExecutors: Type.Optional(Type.Number()),
  archives: Type.Optional(Type.Array(Type.String())),
  queue: Type.Optional(Type.String()),
  conf: Type.Optional(Type.Object({})),
});

export type SubmitRequest = Static<typeof SubmitRequestSchema>;

export const SubmitResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({}),
});

export type SubmitResponse = Static<typeof SubmitResponseSchema>;
