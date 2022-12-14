import { Controller, Get , Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/api/produce/tome_source")
  produceTomeSource(): string {
    console.log('invoke produceTomeSource...')
    return this.appService.produceTomeSource();
  }
}
