import { Controller, Get, Inject } from '@nestjs/common';
import { RequestSessionService } from './pkgs/RequestSessionService';
import { wait } from './pkgs/wait';

@Controller()
export class AppController {
  constructor(
    @Inject(RequestSessionService) private requestSessionService: RequestSessionService,
  ) {}

  @Get('/health')
  async health() {
    return 'OK';
  }
}
