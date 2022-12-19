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
    
    const store = this.event.getSocketData(data["key"]);
    store.then((clientID)=>{
      console.log(`[on consume topic] {@tome_source} got clientID is : ${clientID}`);

      const obj = data; 
      obj["event"] = "source_tomed";

      console.log(`[on consume topic] {@tome_source} [store] new data (add event) to obj is : ${JSON.stringify(obj)}`);
      this.event.server.to(clientID).emit('event',JSON.stringify(obj));

      console.log(`[on consume topic] {@tome_source} ======================= finish [${clientID}]=======================`)
    }).catch((error)=>{
      console.log(`get clientID error ${error}`)
    });


   
    //remove...
    //this.event.deleteSocketData(data["key"]);
    //console.log(`[on consume topic] {@tome_source} [store] remove by key is : ${data["key"]} done`);
  }

  @EventPattern('tome_sink')
  handleSink(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('[on consume topic] {@tome_sink} event-based received message ===> [' + JSON.stringify(data)+"]");
  }

  
  @EventPattern('mfaf.deliveryAddressCreated')
  handleMFAFDeliveryAddressCreated(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('[on consume topic] {@mfaf.deliveryAddressCreated} event-based received message ===> [' + JSON.stringify(data)+"]");

    console.log(`[on consume topic] {@mfaf.deliveryAddressCreated} [store] get clientID by key is : ${data["key"]}`);

    const store = this.event.getSocketData(data["key"]);
    store.then((clientID)=>{
    //const clientID = this.event.getSocketData(data["key"]);
      console.log(`[on consume topic] {@mfaf.deliveryAddressCreated} [store] clientID is : ${clientID}`);

      const obj = data; 
      obj["event"] = "mfaf.deliveryAddressCreated";

      console.log(`[on consume topic] {@mfaf.deliveryAddressCreated} [store] new data (add event) to obj is : ${JSON.stringify(obj)}`);
      this.event.server.to(clientID).emit('event',JSON.stringify(obj));
    }).catch((error)=>{
      console.log(`get clientID error ${error}`)
    });
    //remove...
    //this.event.deleteSocketData(data["key"]);
    //console.log(`[on consume topic] {@mfaf.createDeliveryAddress} [store] remove by key is : ${data["key"]} done`);
  }

  @EventPattern('mfaf.orderPlaced')
  handleMFAFOrderPlaced(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('[on consume topic] {@mfaf.orderPlaced} event-based received message ===> [' + JSON.stringify(data)+"]");

    console.log(`[on consume topic] {@mfaf.orderPlaced}[store] get clientID by key is : ${data["key"]}`);
    const store = this.event.getSocketData(data["key"]);
    store.then((clientID)=>{
    //const clientID = this.event.getSocketData(data["key"]);
      console.log(`[on consume topic] {@mfaf.orderPlaced} [store] clientID is : ${clientID}`);

      const obj = data; 
      obj["event"] = "mfaf.orderPlaced";

      console.log(`[on consume topic] {@mfaf.orderPlaced} [store] new data (add event) to obj is : ${JSON.stringify(obj)}`);
      this.event.server.to(clientID).emit('event',JSON.stringify(obj));
    }).catch((error)=>{
      console.log(`get clientID error ${error}`)
    });
    
    //remove...
    //this.event.deleteSocketData(data["key"]);
    //console.log(`[on consume topic] {@mfaf.placeOrder} [store] remove by key is : ${data["key"]} done`);
  }

  
}