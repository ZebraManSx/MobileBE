import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventbusModule } from './eventbus/eventbus.module';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
//import { ServeStaticModule } from '@nestjs/serve-static';
//import { join } from 'path';
import { EventsModule } from './events/events.module'; 
import { WebSocketModule } from './web-socket/web-socket.module';

import  { redisStore } from 'cache-manager-redis-store';

const kafkaOptions: KafkaOptions = {
 
  transport: Transport.KAFKA,

  options: {
    client: {
      clientId: 'client-demo',
      brokers: ['pkc-22z82.japaneast.azure.confluent.cloud:9092'],
      ssl: true,
      sasl: {
        mechanism: 'plain',
        username: 'I3LJSKCZZFCN3EUE',
        password: 'yuulhyzCyjgF4YqSQ5fgtWvqSZLoxu2BKvqsX0B0ahH/B9kXswBorfyAdVCPSLr/',
      }
    },
    producerOnlyMode: true,
    consumer: {
      groupId: `mobile-backend-instance-${process.env.BE_INSTANCE}`,
      allowAutoTopicCreation: true,
    },
  }
};

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EQX_EVENT_BUS_KAFKA_CLIENT',
        ...kafkaOptions,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      // @ts-ignore
      store: redisStore,
      socket: {
        host: '192.168.1.150',
        port: 6379,
      },
    }),
    WebSocketModule,
    EventbusModule,
    EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
