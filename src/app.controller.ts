import { Body, Controller, Get , Post, Req, Res ,Logger} from '@nestjs/common'; 
import { join } from 'path';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

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
 
  @Post("/api/produce/topic") 
  produceTopic(@Body() body,@Req() req: Request, @Res() res: Response) { 
    this.logger.log(`--- Produce topic ${req.body.topic} START ---`);
    this.logger.log(`[API] Produce Topic ${req.body.topic} body ${JSON.stringify(body)}`)
    this.appService.produceTopic(req.body.topic,req.body.data);
    this.logger.log(`--- Produce topic ${req.body.topic} FINISH ---`)
    res.redirect("/produce-topic");
  }
}
