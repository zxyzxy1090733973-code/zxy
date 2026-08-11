import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

const DEFAULT_API_PORT = 3001;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableShutdownHooks();

  await app.listen(getApiPort());
}

function getApiPort(): number {
  const configuredPort = process.env.API_PORT ?? process.env.PORT;

  if (!configuredPort) {
    return DEFAULT_API_PORT;
  }

  const port = Number.parseInt(configuredPort, 10);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("API_PORT must be a positive integer.");
  }

  return port;
}

await bootstrap();
