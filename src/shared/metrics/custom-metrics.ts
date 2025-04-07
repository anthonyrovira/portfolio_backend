import { Counter, Histogram } from "prom-client";

// Message creation metrics
export const messageCreationCounter = new Counter({
  name: "message_creation_total",
  help: "Total number of messages created",
  labelNames: ["status"],
});

// Email sending metrics
export const emailSendCounter = new Counter({
  name: "email_send_total",
  help: "Total number of emails sent",
  labelNames: ["status"],
});

// Message endpoints response time
export const messageEndpointResponseTime = new Histogram({
  name: "message_endpoint_response_time",
  help: "Response time of message endpoints in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// API request counter
export const apiRequestCounter = new Counter({
  name: "api_requests_total",
  help: "Count of API requests received",
  labelNames: ["method", "path", "status"],
});
