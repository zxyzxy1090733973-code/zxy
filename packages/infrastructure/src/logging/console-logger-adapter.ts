import type { LogFields, LoggerPort } from "@concept-to-model/application";

type LogLevel = "debug" | "info" | "warn" | "error";

export class ConsoleLoggerAdapter implements LoggerPort {
  debug(message: string, fields?: LogFields): void {
    this.write("debug", message, fields);
  }

  info(message: string, fields?: LogFields): void {
    this.write("info", message, fields);
  }

  warn(message: string, fields?: LogFields): void {
    this.write("warn", message, fields);
  }

  error(message: string, fields?: LogFields): void {
    this.write("error", message, fields);
  }

  private write(level: LogLevel, message: string, fields?: LogFields): void {
    if (fields && Object.keys(fields).length > 0) {
      console[level](message, fields);
      return;
    }

    console[level](message);
  }
}
