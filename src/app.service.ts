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
 
  produceTopic(topic: string,data:string) {
    console.log(`topic is :[${topic}] ,data is : [${data}]`)
    this.client.emit(topic,data);
  }
}
