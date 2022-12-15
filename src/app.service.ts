import { Injectable,Inject } from '@nestjs/common';
import {
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
    private readonly client: ClientKafka,
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  produceTomeSource(): string {
    this.client.emit('tome_source','[REST API Produce tome_source] hello 1234 !@#$ ...')
    return 'Hello World!';
  }

  produceTopic(topic: string,data:string) {
    this.client.emit(topic,data);
  }
}
