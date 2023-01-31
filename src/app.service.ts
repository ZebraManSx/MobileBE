import { Injectable,Inject,Logger} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { ClientKafka } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { resolve } from 'path';
import { CreateResource, ResourceCharacteristic } from './mdm/dto/mdm.interfaces';

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

  getMDMEndpoints(){
    const cacheMng = this.cacheManager.get('mdm_endpoints');
    return cacheMng;
  }

  getHello(){
    this.cacheManager.set('myKey' ,`Hello 1234 ${new Date()} from redis`);
    const cacheMng = this.cacheManager.get('myKey');
    return cacheMng;
  }
 
  produceTopic(topic: string,data:string) {
    this.logger.log(`topic is :[${topic}] ,data is : [${data}]`)
    this.client.emit(topic,data);
  }

  createMDMResource(): Promise<CreateResource>{
    return  new Promise((resolve,reject)=>{
      const createResourceResponse = {} as CreateResource;
      createResourceResponse.id = "444";
      createResourceResponse.href = "http://192.168.1.39:3000";
      createResourceResponse.category= "Premium";
      createResourceResponse.value= "0170123456"; 
      createResourceResponse.administrativeState= "unlocked";
      createResourceResponse.operationalState= "disable";
      createResourceResponse.usageState= "idle";
      createResourceResponse.resourceStatus= "available";
      const  resourceChar = {} as ResourceCharacteristic;
      resourceChar.name = "premiumValue";
      resourceChar.valueType = "string";
      resourceChar.value = "gold";
      createResourceResponse.resourceCharacteristic =  [resourceChar];

      resolve(createResourceResponse);
    }); 
  }
}
