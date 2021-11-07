import { User } from '../domain/users/UserInterfaces';
import { Logger } from './Logger';

export interface RequestContext {
  user: User;
  correlationId: string;
  logger: Logger;
}
