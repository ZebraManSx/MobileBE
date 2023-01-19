import { HttpService } from '@nestjs/axios/dist';
import { Injectable,Logger, OnModuleInit ,OnApplicationShutdown } from '@nestjs/common';
import { CreateResource , Say } from './dto/mdm.interfaces';

@Injectable()
export class MdmService implements OnModuleInit ,OnApplicationShutdown{
    private readonly logger = new Logger(MdmService.name);
    constructor(private readonly httpService: HttpService) {}


    stringifyHandle(obj) {
        let cache = [];
        let str = JSON.stringify(obj, function(key, value) {
            if (typeof value === "object" && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        });
        cache = null; // reset the cache
        return str;
    }

    onModuleInit() {
        this.logger.log(`The mobile-backend-instance-${process.env.CONSUMER_GROUP_ID} has been initialized.`);
        /*fetch("http://192.168.1.39:3000/env-info") 
          .then(response => response.json())
          .then(json => {
            const data = json;
            // Do something with the data...
            this.logger.log('response from mdm is : '+JSON.stringify(data)); 
        }).catch(err => {
            console.error(err);
        });*/

        
        const mdmPayLoad = {} as CreateResource;
        mdmPayLoad.id = "11";
        mdmPayLoad.href = "192.168.1.39:3000";

        const aa = this.httpService.axiosRef.post('http://localhost:3000/mdm/resource',mdmPayLoad);
        aa.then((result)=>{
            this.logger.log(`${result.status} ${result.statusText}`); 
            let createResult:CreateResource = result.data as CreateResource; 
            this.logger.log(`createResult ===> :${JSON.stringify(createResult)}`);
            this.logger.log(`createResult.href ===> :${JSON.stringify(createResult.href)}`);
        }).catch((error)=>{
            this.logger.log(`${error}`);   
        })
      }
    
    onApplicationShutdown(signal: string) { 
        this.logger.log(`The mobile-backend-instance-${process.env.CONSUMER_GROUP_ID} recieve ${signal} has been shutdown.`);
    }
}


