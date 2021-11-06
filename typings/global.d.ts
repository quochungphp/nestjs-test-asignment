import { AuthAdminDto } from '../src/domain/auth/AuthAdminDto';
import { Logger } from '../src/pkgs/Logger';

declare global {
  namespace Express {
    interface Request {
      logger: Logger;
      correlationId: string;
      user: AuthAdminDto;
    }
  }
}
