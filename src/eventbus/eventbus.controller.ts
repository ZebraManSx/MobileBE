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
    this.logger.log('consume topic[tome_source] event-based received message ===> [' + JSON.stringify(data)+"]");

    console.log(`get by key is : ${data["key"]}`)
    const clientID = this.event.getSocketData(data["key"]);
    console.log(`got clientID is : ${clientID}`)
    this.event.server.to(clientID).emit('kafka-result',JSON.stringify(data));

    //remove...
  }

  @EventPattern('tome_sink')
  handleSink(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('consume topic[tome_sink] event-based received message ===> [' + JSON.stringify(data)+"]");
  }
}
