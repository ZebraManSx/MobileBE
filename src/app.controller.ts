import { Body, Controller, Get , Post, Req, Res ,Logger} from '@nestjs/common'; 
import { join } from 'path';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { CreateResource, ResourceCharacteristic } from './mdm/dto/mdm.interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  @Get()
  getHello(@Res() res: Response) { 
    const aa = this.appService.getHello();
    aa.then((result)=>{
      res.json({say:result,modifyGroup:process.env.CONSUMER_GROUP_ID,modifytime:new Date()});
    });
  }

  @Get("/env-info")
  getENVInformations() {
    return this.appService.getENVInformations();
  }
  @Get("/mdm/endpoints")
  getMDMEndpoint(@Req() req: Request, @Res() res: Response){
    const aa = this.appService.getMDMEndpoints();
    aa.then((result)=>{
      res.json({endpoints:result});
    });
  }

  @Get("/oda1-event-trigger") 
  viewODA1EventTrigger(@Req() req: Request, @Res() res: Response) { 
    res.sendFile(join(__dirname, '/views/oda1-event-trigger.html'));
  }

  @Get("/oda2-event-trigger") 
  viewODA2EventTrigger(@Req() req: Request, @Res() res: Response) { 
    res.sendFile(join(__dirname, '/views/oda2-event-trigger.html'));
  }

  @Get("/produce-topic") 
  viewProduceTopic(@Req() req: Request, @Res() res: Response) { 
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

  @Post("/mdm/resource")
  createMDMResource(@Body() body,@Req() req: Request, @Res() res: Response) {
    this.logger.log(`--- createMDMResource START ---`);
    this.logger.log(`[API] createMDMResource request is: ${JSON.stringify(body)}`) 
   

    const createResourceResponse = this.appService.createMDMResource();
    createResourceResponse.then((result)=>{
      this.logger.log(`[API] createMDMResource response is: ${JSON.stringify(result)}`) 

      this.logger.log(`--- createMDMResource FINISH ---`)
      res.status(201).json(result);
    
    }).catch((error)=>{
      this.logger.log(`[API] createMDMResource error ${error}`) 
    });
  }

}
