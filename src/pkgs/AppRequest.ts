import { Request } from 'express';
import { User } from '../domain/users/UserInterfaces';
import { Logger } from './Logger';

export interface AppRequest extends Request {
  user: User;
  correlationId: string;
  logger: Logger;
}
