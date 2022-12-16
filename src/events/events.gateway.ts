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
    console.log("[on command] data is : "+JSON.stringify(body))
    console.log("[on command] client is : "+ client.id)
    const topic = "mfaf.createDeliveryAddress";
    this.client.emit("tome_source",JSON.stringify(body))
    console.log("[on command] produce topic tome_source done")
    const commandResult = {
      "clientid" : client.id,
      "topic" : topic,
      "payload" : body
    }

    console.log(`push key is : ${body["key"]}`) 
    console.log(`with clientID is : ${client.id}`)
    this.webSocketService.pushSocketData(body["key"],client.id);
   
    this.server.to(client.id).emit('command-result',JSON.stringify(commandResult));
    const ack = {"result":"act"}
    return ack;
  }

  @SubscribeMessage('query')
  onQuery(@ConnectedSocket() client: any, @MessageBody() body: any){
    //TBC
  }
 
}
