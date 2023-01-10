import { Injectable,Inject,Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { ClientKafka } from '@nestjs/microservices';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
    private readonly client: ClientKafka,
    @Inject(CACHE_MANAGER) private readonly cacheManager : Cache
  ){}

  getENVInformations(){
    return process.env;
  }

  getHello(){
    this.cacheManager.set('myKey' ,`1234 ${new Date()}`);
    const aa = this.cacheManager.get('myKey');
    aa.then((cacheValue)=>{
      this.logger.log(`[on cachManager] cacheValue is : ${cacheValue}`);
    }).catch((error)=>{ 
      this.logger.log(`[on cachManager error ] ${error}`)
    });
    return 'Hello World!';
  }
 
  produceTopic(topic: string,data:string) {
    this.logger.log(`topic is :[${topic}] ,data is : [${data}]`)
    this.client.emit(topic,data);
  }

}
