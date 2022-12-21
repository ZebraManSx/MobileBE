import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket,OnGatewayInit ,OnGatewayConnection} from '@nestjs/websockets';
 
 
import { Server } from 'socket.io'; 
import { WebSocketService } from 'src/web-socket/web-socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit {
  constructor(
    @Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
    private readonly client: ClientKafka,
    private webSocketService: WebSocketService
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
    console.log(`afterInit...`)
    this.webSocketService.server = server;
  }

  @SubscribeMessage('command')
  onCommand(@ConnectedSocket() client: any, @MessageBody() body: any){
    console.log(`[on command] ======================= start transaction [${client.id}]=======================`)
    console.log("[on command] data is : "+JSON.stringify(body))
    console.log("[on command] client is : "+ client.id)
    const topic = body["command"]//"mfaf.createDeliveryAddress";
    console.log(`[on command] topic is : ${topic}`)
    this.client.emit(topic,JSON.stringify(body))
    console.log(`[on command] produce topic ${topic} done`)

    const commandResult = {
      "clientid" : client.id,
      "topic" : topic,
      "payload" : body
    }

    console.log(`[on command] [store] push key is : ${body["key"]}`); 
    console.log(`[on command] [store] with clientID is : ${client.id}`);

    const ack = {"result":"act"}
    this.webSocketService.pushSocketData(body["key"],client.id);
    /*store.then((isStore)=>{
      console.log(`store is : ${isStore}`)
      this.server.to(client.id).emit('command-result',JSON.stringify(commandResult));
    }).catch((error)=>{ 
      console.log(`can't store error is ${error}`)
    })*/

    this.server.to(client.id).emit('command-result',JSON.stringify(commandResult));
    return ack;
  }

  @SubscribeMessage('query')
  onQuery(@ConnectedSocket() client: any, @MessageBody() body: any){
    //TBC
    const ack = {"result":"act","todo":"none"}
    return ack;
  }
 
}
