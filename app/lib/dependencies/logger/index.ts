import { DevConsoleLogger } from "./DevConsoleLogger";
import { ILogger } from "./ILogger";
import { SentryLogger } from "./SentryLogger";

const noopLogger: ILogger = {
  setUser: () => {},
  info: () => {},
  verbose: () => {},
  debug: () => {},
  warn: () => {},
  error: () => {},
  fatal: () => {},
};

const resolveLogger = () => {
  if (process.env.NF_SENTRY_DSN) {
    return new SentryLogger(process.env.NF_SENTRY_DSN);
  }

  return new DevConsoleLogger();
};

export { ILogger, resolveLogger, noopLogger };
