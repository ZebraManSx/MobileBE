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

@Controller('eventbus')
export class EventbusController {
  private readonly logger = new Logger(EventbusController.name);

  constructor(
    @Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
    private readonly client: ClientKafka,
    private readonly event: WebSocketService,
    @Inject(CACHE_MANAGER) private readonly cacheManager : Cache
  ) {}

  @EventPattern('tome_source')
  handle(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('[on consume topic] {@tome_source} event-based received message ===> [' + JSON.stringify(data)+"]");

    const topic = "tome_sink"
    this.logger.log(`[on consume topic] {@tome_source} emit message to topic :${topic} ===>  + JSON.stringify(${data})`);
    this.client.emit(topic,JSON.stringify(data))
    this.logger.log(`[on command topic] {@tome_source} produce topic ${topic} done`)
    /*
    const cacheMng =   this.cacheManager.get(data["key"]) 
    cacheMng.then((socketId)=>{
      this.logger.log(`[on consume topic] {@tome_source} [radis] get socketId object by ${data["key"]} ,result is : ${JSON.stringify(socketId)}`);
      const clientid = socketId["socketid"];
      this.logger.log(`[on consume topic] {@tome_source} [radis] get clientid is : ${clientid}`);

      const obj = data; 
      obj["event"] = "source_tomed";
      obj["modify_instance"] = process.env.BE_INSTANCE;
      
      this.logger.log(`[on consume topic] {@tome_source} new data (add event) to obj is : ${JSON.stringify(obj)}`);
      this.event.server.to(clientid).emit('event',obj);

      this.logger.log(`[on consume topic] {@tome_source} ======================= finish transaction [${clientid}] (emit with Object) =======================`);
    }).catch((error)=>{
      this.logger.log(`[on consume topic] {@tome_source} got error is : ${error}`);
    })
      
     
      
    const store = this.event.getSocketData(data["key"]);
    store.then((clientID)=>{
      this.logger.log(`[on consume topic] {@tome_source} got clientID is : ${clientID}`);

      const obj = data; 
      obj["event"] = "source_tomed";

      this.logger.log(`[on consume topic] {@tome_source} [store] new data (add event) to obj is : ${JSON.stringify(obj)}`);
      this.event.server.to(clientID).emit('event',obj);

      this.logger.log(`[on consume topic] {@tome_source} ======================= finish transaction [${clientID}] (emit with Object) =======================`);
    }).catch((error)=>{ 
      this.logger.log(`[on consume topic] {@tome_source} ======================= get clientID error ${error} =======================`);
    });

    */
   
    //remove...
    //this.event.deleteSocketData(data["key"]);
    //console.log(`[on consume topic] {@tome_source} [store] remove by key is : ${data["key"]} done`);
  }

  @EventPattern('tome_sink')
  handleSink(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('[on consume topic] {@tome_sink} event-based received message ===> [' + JSON.stringify(data)+"]");

    const cacheMng =   this.cacheManager.get(data["key"]) 
    cacheMng.then((socketId)=>{
      this.logger.log(`[on consume topic] {@tome_sink} [radis] get socketId object by ${data["key"]} ,result is : ${JSON.stringify(socketId)}`);
      const clientid = socketId["socketid"];
      this.logger.log(`[on consume topic] {@tome_sink} [radis] get clientid is : ${clientid}`);

      const obj = data; 
      obj["event"] = "sink_tomed";
      obj["modify_instance"] = process.env.BE_INSTANCE;
      obj["modifytime"] = new Date();

      this.logger.log(`[on consume topic] {@tome_sink} new data (add event) to obj is : ${JSON.stringify(obj)}`);
      this.event.server.to(clientid).emit('event',obj);

      this.logger.log(`[on consume topic] {@tome_sink} ======================= finish transaction [${clientid}] (emit with Object) =======================`);
    }).catch((error)=>{
      this.logger.log(`[on consume topic] {@tome_sink} got error is : ${error}`);
    })
  }

  
  @EventPattern('mfaf.deliveryAddressCreated')
  handleMFAFDeliveryAddressCreated(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('[on consume topic] {@mfaf.deliveryAddressCreated} event-based received message ===> [' + JSON.stringify(data)+"]");

    this.logger.log(`[on consume topic] {@mfaf.deliveryAddressCreated} [store] get clientID by key is : ${data["key"]}`);

    const store = this.event.getSocketData(data["key"]);
    store.then((clientID)=>{
      //const clientID = this.event.getSocketData(data["key"]);
      this.logger.log(`[on consume topic] {@mfaf.deliveryAddressCreated} [store] clientID is : ${clientID}`);

      const obj = data; 
      obj["event"] = "mfaf.deliveryAddressCreated";

      this.logger.log(`[on consume topic] {@mfaf.deliveryAddressCreated} [store] new data (add event) to obj is : ${JSON.stringify(obj)}`);
      this.event.server.to(clientID).emit('event',obj);
      this.logger.log(`[on consume topic] {@mfaf.deliveryAddressCreated} ======================= finish transaction [${clientID}] (emit with Object) =======================`);
    
    }).catch((error)=>{ 
      this.logger.log(`[on consume topic] {@mfaf.deliveryAddressCreated} ======================= get clientID error ${error} =======================`);
    });
    //remove...
    //this.event.deleteSocketData(data["key"]);
    //console.log(`[on consume topic] {@mfaf.createDeliveryAddress} [store] remove by key is : ${data["key"]} done`);
  }

  @EventPattern('mfaf.orderPlaced')
  handleMFAFOrderPlaced(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('[on consume topic] {@mfaf.orderPlaced} event-based received message ===> [' + JSON.stringify(data)+"]");

    this.logger.log(`[on consume topic] {@mfaf.orderPlaced}[store] get clientID by key is : ${data["key"]}`);
    const store = this.event.getSocketData(data["key"]);
    store.then((clientID)=>{
      //const clientID = this.event.getSocketData(data["key"]);
      this.logger.log(`[on consume topic] {@mfaf.orderPlaced} [store] clientID is : ${clientID}`);

      const obj = data; 
      obj["event"] = "mfaf.orderPlaced";

      this.logger.log(`[on consume topic] {@mfaf.orderPlaced} [store] new data (add event) to obj is : ${JSON.stringify(obj)}`);
      this.event.server.to(clientID).emit('event',obj);
      this.logger.log(`[on consume topic] {@mfaf.orderPlaced} ======================= finish transaction [${clientID}] (emit with Object) =======================`);
  
    }).catch((error)=>{ 
      this.logger.log(`[on consume topic] {@mfaf.orderPlaced} ======================= get clientID error ${error} =======================`);
  
    });
    
    //remove...
    //this.event.deleteSocketData(data["key"]);
    //console.log(`[on consume topic] {@mfaf.placeOrder} [store] remove by key is : ${data["key"]} done`);
  }

  
}