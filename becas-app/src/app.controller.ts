import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('saludos')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/1')
  getHello(): string {
    return this.appService.getHello();
  }
}
