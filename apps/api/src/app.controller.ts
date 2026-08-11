import { Controller, Get } from "@nestjs/common";

export interface HealthResponse {
  readonly service: "api";
  readonly status: "ok";
}

@Controller()
export class AppController {
  @Get("health")
  getHealth(): HealthResponse {
    return {
      service: "api",
      status: "ok",
    };
  }
}
