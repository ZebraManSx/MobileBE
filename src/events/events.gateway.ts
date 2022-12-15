import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
 
 
import { Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(
    @Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
    private readonly client: ClientKafka,
  ) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@ConnectedSocket() client: any, @MessageBody() body: any){
   console.log("data is : "+JSON.stringify(body))
   console.log("client is : "+ client.id)
   this.server.emit('hello sender...')
   this.server.to(client.id).emit('produce-topic-response',"["+client.id+"]"+JSON.stringify(body));
   this.server.to(client.id).emit('events',"["+client.id+"]hello socket.io from HTML... at :"+new Date());
  }


 
  @SubscribeMessage('command')
  produceTopic(@ConnectedSocket() client: any, @MessageBody() body: any){ 
    console.log("[on command] data is : "+JSON.stringify(body))
    console.log("[on command] client is : "+ client.id)
    this.client.emit("tome_source",JSON.stringify(body))
    this.server.to(client.id).emit('command-response',"["+client.id+"]"+JSON.stringify(body));
    //this.server.to(client.id).emit('1234');
    console.log("[on command] produce tome_source data done")
  }
  @SubscribeMessage('testmessage')
  testMessage(@ConnectedSocket() client: any, @MessageBody() body: any){
    console.log("[on testmessage] data is : "+JSON.stringify(body))
    console.log("[on testmessage] client is : "+ client.id)
    return 'hello testmessage'
  }

  @SubscribeMessage('query')
  queryMongo(@ConnectedSocket() client: any, @MessageBody() body: any){

  }
 
}
