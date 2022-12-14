import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventbusModule } from './eventbus/eventbus.module';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';

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
      groupId: '2',
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
    ]),EventbusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
