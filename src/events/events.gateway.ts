import { Inject ,Logger} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { ClientKafka } from '@nestjs/microservices';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket,OnGatewayInit ,OnGatewayConnection} from '@nestjs/websockets';
 
 
import { Server } from 'socket.io'; 
import { WebSocketService } from 'src/web-socket/web-socket.service';

import { Cache } from 'cache-manager'; 

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit {
  private readonly logger = new Logger(EventsGateway.name);

  constructor(
    @Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
    private readonly client: ClientKafka,
    private webSocketService: WebSocketService,
    @Inject(CACHE_MANAGER) private readonly cacheManager : Cache
  ) {}
  @WebSocketServer()
  server: Server| undefined;

  /**
   * 2 : key (deviceid + appid)  | value : socket:id


      7 8 
      xxx = key(deviceid + appid) | find for value (socket.id)


      socketio.to(xxx)

    */
  afterInit(server: Server) {
    this.logger.log(`EventsGateway on afterInit...`)
    this.webSocketService.server = server;
  }

  @SubscribeMessage('command')
  onCommand(@ConnectedSocket() client: any, @MessageBody() body: any){
     const ack = {"result":"act"}
    try{
    this.logger.log(`[on command] ======================= start transaction [${client.id}]=======================`)
    this.logger.log("[on command] data is : "+JSON.stringify(body))
    this.logger.log("[on command] client is : "+ client.id)
    const topic = body["command"]//"mfaf.createDeliveryAddress";
    this.logger.log(`[on command] topic is : ${topic}`)
    this.client.emit(topic,JSON.stringify(body))
    this.logger.log(`[on command] produce topic ${topic} done`)

    const commandResult = {
      "clientid" : client.id,
      "topic" : topic,
      "payload" : body
    }

    //this.logger.log(`[on command] [store] push key is : ${body["key"]}`); 
    //this.logger.log(`[on command] [store] with clientID is : ${client.id}`);

    const ack = {"result":"act"}
    //this.webSocketService.pushSocketData(body["key"],client.id);
    
    /*store.then((isStore)=>{
      console.log(`store is : ${isStore}`)
      this.server.to(client.id).emit('command-result',JSON.stringify(commandResult));
    }).catch((error)=>{ 
      console.log(`can't store error is ${error}`)
    })*/
 
    const ttl = 6000;
    this.logger.log(`[on command] [redis] set key : ${body["key"]} ,value : ${client.id} ,ttl : ${ttl}`); 

    const applicationCacheObj = {"socketid":client.id,
    "modify_instance": process.env.BE_INSTANCE,
    "modifytime": new Date()
  };

    const cacheMng =  this.cacheManager.set(body["key"],applicationCacheObj, ttl);
    cacheMng.then((result)=>{
      this.logger.log(`[on command] [redis] set result : ${result}`); 
    }).catch((error)=>{
      this.logger.log(`[on command] [redis] set error : ${error}`); 
    })
    
    //console.log(`[on command] [redis] set key : ${body["key"]} ,value : ${client.id} ,ttl : ${ttl}`); 

    this.server.to(client.id).emit('command-result',JSON.stringify(commandResult));
  }catch(error){
    this.logger.log(`error is : ${error}`)
  }
    return ack;
  }

  @SubscribeMessage('query')
  onQuery(@ConnectedSocket() client: any, @MessageBody() body: any){
    //TBC
    const ack = {"result":"act","todo":"none"}
    return ack;
  }
 
}
