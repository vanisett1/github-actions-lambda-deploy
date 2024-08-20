'use strict';

const opentelemetry = require('@opentelemetry/sdk-node');
const { diag, DiagConsoleLogger } = require('@opentelemetry/api');
const { envDetectorSync, hostDetectorSync } = require('@opentelemetry/resources');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { FastifyInstrumentation } = require('@opentelemetry/instrumentation-fastify');
const { PinoInstrumentation } = require('@opentelemetry/instrumentation-pino');

diag.setLogger(
    new DiagConsoleLogger(),
    opentelemetry.core.getEnv().OTEL_LOG_LEVEL
);

const sdk = new opentelemetry.NodeSDK({
  instrumentations: [
    new HttpInstrumentation(),
    new FastifyInstrumentation(),
    new PinoInstrumentation()
  ],
  resourceDetectors: [envDetectorSync, hostDetectorSync]
});

try {
  sdk.start();
  diag.info("OpenTelemetry automatic instrumentation started successfully");
} catch (error) {
  diag.error(
      "Error initializing OpenTelemetry SDK. Your application is not instrumented and will not produce telemetry",
      error
  );
}

process.on("SIGTERM", () => {
  sdk
      .shutdown()
      .then(() => diag.debug("OpenTelemetry SDK terminated"))
      .catch(error => diag.error("Error terminating OpenTelemetry SDK", error));
});
