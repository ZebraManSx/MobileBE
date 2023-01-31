import { Inject ,Logger} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { ClientKafka } from '@nestjs/microservices';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket,OnGatewayInit ,OnGatewayConnection} from '@nestjs/websockets';
  
import { Server } from 'socket.io'; 
import { WebSocketService } from 'src/web-socket/web-socket.service';

import { Cache } from 'cache-manager'; 
import { Socket } from 'socket.io';
//import { Admin, Kafka } from 'kafkajs' 

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit ,OnGatewayConnection{
  private readonly logger = new Logger(EventsGateway.name);

  constructor(
    @Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
    private readonly client: ClientKafka,
    private webSocketService: WebSocketService,
    @Inject(CACHE_MANAGER) private readonly cacheManager : Cache,

    //@Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
    //private readonly kk: Kafka,
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
    this.logger.log(`***** on afterInit... *****`)
    this.webSocketService.server = server;
    /*
    const aa:Admin = this.kk.admin();
    const bb = aa.resetOffsets({
      groupId: "",
      topic: "",
      earliest: false});
      bb.then((result)=>{

      }).catch((error)=>{

      })*/
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`***** on handleConnection... *****`)
    const applicationCacheKey = `${client.handshake.headers.key}`;
    const cacheMng =  this.cacheManager.get(applicationCacheKey);
    cacheMng.then((result)=>{
      if(result!=null){
        this.logger.log(`key="${applicationCacheKey}" , value=${JSON.stringify(result)}`)

        const newCache =  result;
        newCache["socketid"] = client.id;
        const updateCacheMng = this.cacheManager.set(applicationCacheKey,newCache);
        updateCacheMng.then((result)=>{
          this.logger.log(`update key="${applicationCacheKey}" , value=${JSON.stringify(newCache)} is ${result}`)
        }).catch((error)=>{
          this.logger.log(error);
        });

      }else{
        this.logger.log(`key="${applicationCacheKey}" not found`)
      }
    }).catch((error)=>{
      this.logger.log(`error:${error}`);
    })
  }

  @SubscribeMessage('command')
  onCommand(@ConnectedSocket() client: Socket, @MessageBody() body: any){
    const ack = {"result":"act"}
    try{
      const applicationCacheKey = `${client.handshake.headers.key}`
      this.logger.log(`[on command] ======= start transaction [${applicationCacheKey}] ======`)
      this.logger.log("[on command] data [OLD] is : "+JSON.stringify(body))
      const payloadKey = body["key"]

      this.logger.log(`[on command] begin transaction client client.handshake.address is: ${client.handshake.address}`)
      this.logger.log(`[on command] begin transaction client client.handshake.headers is: ${JSON.stringify(client.handshake.headers)}`)
      this.logger.log(`[on command] begin transaction client client.handshake.auth is: ${JSON.stringify(client.handshake.auth)}`)

      const newObj = body; 
      newObj["key"] = applicationCacheKey;
      
      this.logger.log("[on command] data [NEW] is : "+JSON.stringify(newObj))
      this.logger.log("[on command] client is : "+ client.id)
      const topic = newObj["command"] //"mfaf.createDeliveryAddress";
      this.logger.log(`[on command] topic is : ${topic}`)
      this.client.emit(topic,JSON.stringify(newObj))
      this.logger.log(`[on command] produce topic ${topic} done`)

      const commandResult = {
        "clientid" : client.id,
        "topic" : topic,
        "payload" : body
      }

    //this.logger.log(`[on command] [store] push key is : ${body["key"]}`); 
    //this.logger.log(`[on command] [store] with clientID is : ${client.id}`);

    //const ack = {"result":"act"}
    //this.webSocketService.pushSocketData(body["key"],client.id);
    
    /*store.then((isStore)=>{
      console.log(`store is : ${isStore}`)
      this.server.to(client.id).emit('command-result',JSON.stringify(commandResult));
    }).catch((error)=>{ 
      console.log(`can't store error is ${error}`)
    })*/
 
      const ttl = 6000;
      const applicationCacheValue = {"socketid":client.id,
        "payloadkey": payloadKey,
        "modify_instance": process.env.CONSUMER_GROUP_ID,
        "modifytime": new Date()
      };

      this.logger.log(`[on command] [redis] set key : ${applicationCacheKey} ,value : ${applicationCacheValue} ,ttl : ${ttl}`); 
      const cacheMng =  this.cacheManager.set(applicationCacheKey,applicationCacheValue, ttl);
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
