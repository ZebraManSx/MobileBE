import { Controller, Inject, Logger } from '@nestjs/common';
import {
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

@Controller('eventbus')
export class EventbusController {
  private readonly logger = new Logger(EventbusController.name);

  constructor(
    @Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
    private readonly client: ClientKafka,
  ) {}

  @EventPattern('tome_source')
  handle(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('consume topic[tome_source] event-based received message ===> [' + data+"]");
  }


  @EventPattern('tome_sink')
  handleSink(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log('consume topic[tome_sink] event-based received message ===> [' + data+"]");
  }
}
