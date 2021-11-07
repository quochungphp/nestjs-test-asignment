import { Logger } from '../src/pkgs/Logger';

declare global {
  namespace Express {
    interface Request {
      logger: Logger;
      correlationId: string;
    }
  }
}
