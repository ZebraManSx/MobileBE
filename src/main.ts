import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
//import { join } from 'path';

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
    }
  }
};
 
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.DEBUG_MODE && process.env.DEBUG_MODE === 'true'
        ? ['log', 'error', 'warn', 'debug']
        : ['log', 'error', 'warn'],
  });

  app.connectMicroservice(kafkaOptions);

  await app.startAllMicroservices();
  //console.log('dir is : '+join(__dirname, 'views'));
  //app.useStaticAssets(join(__dirname, 'views'));
  //app.setViewEngine('html');
  await app.listen(3000);
}
bootstrap();
