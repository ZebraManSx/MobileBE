import { Body, Controller, Get , Post, Req, Res } from '@nestjs/common'; 
import { join } from 'path';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/produce-topic") 
  viewTopic(@Req() req: Request, @Res() res: Response) { 
    res.sendFile(join(__dirname, '/views/produce-topic.html'));
  }

  @Post("/api/produce/topic") 
  produceTopic(@Body() body,@Req() req: Request, @Res() res: Response) { 
    console.log("[API]Produce Topic body ===>"+JSON.stringify(body))
    this.appService.produceTopic(req.body.topic,req.body.data);
    res.redirect("/produce-topic");
  }
}
