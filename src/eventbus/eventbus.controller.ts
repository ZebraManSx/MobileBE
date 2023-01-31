import { CACHE_MANAGER, Controller, Inject, Logger } from '@nestjs/common';
import {
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';   
import { WebSocketService } from 'src/web-socket/web-socket.service';
import { Cache } from 'cache-manager';  
import { EventbusService } from './eventbus.service';

@Controller('eventbus')
export class EventbusController {
  private readonly logger = new Logger(EventbusController.name);

  constructor(
    @Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
    private readonly client: ClientKafka,
    private readonly event: WebSocketService,
    @Inject(CACHE_MANAGER) private readonly cacheManager : Cache,
    private readonly eventbusService: EventbusService
  ) {}
 
  @EventPattern('tome_source')
  handle(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log(`[on consume topic] ${context.getTopic()} event-based received message ===> ${JSON.stringify(data)}`);

    const isProduceTomeSink = data["isProduceTomeSink"];
    this.logger.log(`[on command topic] ${context.getTopic()} isProduceTomeSink is : ${isProduceTomeSink}`)
    if(isProduceTomeSink){
      const topicProduce = "tome_sink"
      this.logger.log(`[on consume topic] ${context.getTopic()} emit message to topic :${topicProduce} ===>  + JSON.stringify(${data})`);
      this.client.emit(topicProduce,JSON.stringify(data))
      this.logger.log(`[on command topic] ${context.getTopic()} produce topic ${topicProduce} done`)
    }else{
      this.logger.log(`[on command topic] ${context.getTopic()} waiting for produce topic : tome_sink from anyone(producer) ....`)
      this.logger.log(`[on command topic] ${context.getTopic()} ...`);
      this.logger.log(`[on command topic] ${context.getTopic()} ..`);
      this.logger.log(`[on command topic] ${context.getTopic()} .`);
    }
  }

  @EventPattern('tome_sink')
  handleSink(@Payload() data: any, @Ctx() context: KafkaContext) {
    const consumer = this.eventbusService.consume(data,context);
    consumer.then((result)=>{
      this.logger.log(`${context.getTopic()} consumer result : ${result}`);
    }).catch((error)=>{
      this.logger.log(`${context.getTopic()} consumer got error : ${error}`);
    });
  }

  @EventPattern('mfaf.deliveryAddressCreated')
  handleMFAFDeliveryAddressCreated(@Payload() data: any, @Ctx() context: KafkaContext) {
    const consumer = this.eventbusService.consume(data,context);
    consumer.then((result)=>{
      this.logger.log(`${context.getTopic()} consumer result : ${result}`);
    }).catch((error)=>{
      this.logger.log(`${context.getTopic()} consumer got error : ${error}`);
    });
  }

  @EventPattern('mfaf.orderPlaced')
  handleMFAFOrderPlaced(@Payload() data: any, @Ctx() context: KafkaContext) {
    const consumer = this.eventbusService.consume(data,context);
    consumer.then((result)=>{
      this.logger.log(`${context.getTopic()} consumer result : ${result}`);
    }).catch((error)=>{
      this.logger.log(`${context.getTopic()} consumer got error : ${error}`);
    });
  }

}