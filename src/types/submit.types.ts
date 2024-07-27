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
  conf: Type.Optional(Type.Record(Type.String(), Type.Any())),
});

export type SubmitRequest = Static<typeof SubmitRequestSchema>;

export const SubmitResponseSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  owner: Type.Union([Type.String(), Type.Null()]),
  proxyUser: Type.Union([Type.String(), Type.Null()]),
  state: Type.String(),
  appId: Type.Union([Type.String(), Type.Null()]),
  appInfo: Type.Object({
    driverLogUrl: Type.Union([Type.String(), Type.Null()]),
    sparkUiUrl: Type.Union([Type.String(), Type.Null()]),
  }),
  log: Type.Array(Type.String()),
});

export const AppInfoSchema = Type.Object({
  driverLogUrl: Type.Union([Type.String(), Type.Null()]),
  sparkUiUrl: Type.Union([Type.String(), Type.Null()]),
});

export const JobStatusResponseSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  owner: Type.Union([Type.String(), Type.Null()]),
  proxyUser: Type.Union([Type.String(), Type.Null()]),
  state: Type.String(),
  appId: Type.Union([Type.String(), Type.Null()]),
  appInfo: AppInfoSchema,
  log: Type.Array(Type.String()),
});
export type SubmitResponse = Static<typeof SubmitResponseSchema>;
export const JobParamsSchema = Type.Object({
  batch_id: Type.String(),
});

export type JobParams = Static<typeof JobParamsSchema>;

export const ErrorResponseSchema = Type.Object({
  message: Type.String(),
});

export type ErrorResponse = Static<typeof ErrorResponseSchema>;

export type JobStatusResponse = Static<typeof JobStatusResponseSchema>;

export const JobResultResponseSchema = Type.Object({
  id: Type.Number(),
  state: Type.String(),
});

export type JobResultResponse = Static<typeof JobResultResponseSchema>;
