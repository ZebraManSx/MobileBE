import { Body, Controller, Get , Post, Req, Res } from '@nestjs/common'; 
import { join } from 'path';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get("/env-info")
  getENVInformations() {
    return this.appService.getENVInformations();
  }

  @Get("/produce-topic") 
  viewTopic(@Req() req: Request, @Res() res: Response) { 
    res.sendFile(join(__dirname, '/views/produce-topic.html'));
  }

  @Get("/produce-topic-dev") 
  viewTopicDev(@Req() req: Request, @Res() res: Response) { 
    res.sendFile(join(__dirname, '/views/produce-topic-dev.html'));
  }

  @Post("/api/produce/topic") 
  produceTopic(@Body() body,@Req() req: Request, @Res() res: Response) { 
    console.log("[API]Produce Topic body ===>"+JSON.stringify(body))
    this.appService.produceTopic(req.body.topic,req.body.data);
    res.redirect("/produce-topic");
  }
}
