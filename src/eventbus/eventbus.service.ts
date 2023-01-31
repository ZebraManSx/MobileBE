import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka, Ctx, KafkaContext, Payload } from '@nestjs/microservices';
import { WebSocketService } from 'src/web-socket/web-socket.service';
import { Cache } from 'cache-manager'; 

@Injectable()
export class EventbusService {
    private readonly logger = new Logger(EventbusService.name);
    constructor(
        @Inject('EQX_EVENT_BUS_KAFKA_CLIENT')
        private readonly client: ClientKafka,
        private readonly event: WebSocketService,
        @Inject(CACHE_MANAGER) private readonly cacheManager : Cache
      ) {}

    consume(@Payload() data: any, @Ctx() context: KafkaContext): Promise<any> {
        return new Promise((resolve,reject)=>{
            this.logger.log(`${context.getTopic()} event-based received message ===> ${JSON.stringify(data)}`);
            this.logger.log(`${context.getTopic()} [kafka] get clientid is : ${data["key"]}`);
        
            const cacheMng = this.cacheManager.get(data["key"]); 
            cacheMng.then((cacheData)=>{ 
                this.logger.log(`${context.getTopic()} [radis] get cacheData by ${data["key"]} ,value is : ${JSON.stringify(cacheData)}`);
                const clientid = cacheData["socketid"];
                this.logger.log(`${context.getTopic()} [radis] clientid is : ${clientid}`);
            
                const obj = data; 
                obj["key"] = cacheData["payloadkey"];
                obj["event"] = context.getTopic();
                obj["modify_instance"] = process.env.CONSUMER_GROUP_ID;
                obj["modifytime"] = new Date();
                
                this.logger.log(`${context.getTopic()} new data (add event) to obj is : ${JSON.stringify(obj)}`);
                this.event.server.to(clientid).emit('event',obj);
                this.logger.log(`${context.getTopic()} ======= finish transaction [${clientid}] (emit with Object) =======`);
                resolve('ok'); 
            }).catch((error)=>{ 
                reject(error);
            });
        })
      }
}
