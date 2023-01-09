import { Module } from '@nestjs/common';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { logLevel } from 'kafkajs';
import { EventsGateway } from './events.gateway';  

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
        },
        logLevel: logLevel.INFO
      },
      producerOnlyMode: true,
      consumer: {
        groupId: `mobile-backend-instance-${process.env.BE_INSTANCE}`,
        allowAutoTopicCreation: true,
      },
    }
  };
  
@Module({
    imports: [ClientsModule.register([
        {
          name: 'EQX_EVENT_BUS_KAFKA_CLIENT',
          ...kafkaOptions,
        },
      ]),
    ],
    providers: [EventsGateway],
})
export class EventsModule {}
