import { Controller, Inject, Logger } from '@nestjs/common';
import {
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';   
import { WebSocketService } from 'src/web-socket/web-socket.service';
 

@Controller('eventbus')
export class EventbusController {
  private readonly logger = new Logger(EventbusController.name);

  constructor(
    @Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
    private readonly client: ClientKafka,
    private readonly event: WebSocketService //EventsGateway
  ) {}

  @EventPattern('tome_source')
  handle(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('[on consume topic] {@tome_source} event-based received message ===> [' + JSON.stringify(data)+"]");

    console.log(`[on consume topic] {@tome_source} get by key is : ${data["key"]}`);
    const clientID = this.event.getSocketData(data["key"]);
    console.log(`[on consume topic] {@tome_source} got clientID is : ${clientID}`);
    this.event.server.to(clientID).emit('event',JSON.stringify(data));

    //remove...
    //this.event.deleteSocketData(data["key"]);
    //console.log(`[on consume topic] {@tome_source} [store] remove by key is : ${data["key"]} done`);
  }

  @EventPattern('tome_sink')
  handleSink(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('[on consume topic] {@tome_sink} event-based received message ===> [' + JSON.stringify(data)+"]");
  }

  
  @EventPattern('mfaf.createDeliveryAddress')
  handleMFAFCreateDeliveryAddress(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('[on consume topic] {@mfaf.createDeliveryAddress} event-based received message ===> [' + JSON.stringify(data)+"]");

    console.log(`[on consume topic] {@mfaf.createDeliveryAddress} [store] get clientID by key is : ${data["key"]}`);
    const clientID = this.event.getSocketData(data["key"]);
    console.log(`[on consume topic] {@mfaf.createDeliveryAddress} [store] clientID is : ${clientID}`);
    this.event.server.to(clientID).emit('event',JSON.stringify(data));

    //remove...
    //this.event.deleteSocketData(data["key"]);
    //console.log(`[on consume topic] {@mfaf.createDeliveryAddress} [store] remove by key is : ${data["key"]} done`);
  }

  @EventPattern('mfaf.placeOrder')
  handleMFAFPlaceOrder(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('[on consume topic] {@mfaf.placeOrder} event-based received message ===> [' + JSON.stringify(data)+"]");

    console.log(`[on consume topic] {@mfaf.placeOrder}[store] get clientID by key is : ${data["key"]}`);
    const clientID = this.event.getSocketData(data["key"]);
    console.log(`[on consume topic] {@mfaf.placeOrder} [store] clientID is : ${clientID}`);
    this.event.server.to(clientID).emit('event',JSON.stringify(data));

    //remove...
    //this.event.deleteSocketData(data["key"]);
    //console.log(`[on consume topic] {@mfaf.placeOrder} [store] remove by key is : ${data["key"]} done`);
  }

  
}
