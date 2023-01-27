import { HttpService } from '@nestjs/axios/dist';
import { Injectable,Logger, OnModuleInit ,OnApplicationShutdown } from '@nestjs/common';
import { async } from 'rxjs';
import { CreateResource , ResourceCharacteristic} from './dto/mdm.interfaces';

@Injectable()
export class MdmService implements OnModuleInit ,OnApplicationShutdown{
    private readonly logger = new Logger(MdmService.name);
    constructor(private readonly httpService: HttpService) {}
    private mdmID = '';

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
        //mdmPayLoad.href = "http://192.168.1.39:3000"; //at home
        mdmPayLoad.href = "http://10.10.0.167:3000"; //at office
        mdmPayLoad['@type'] = "CEDA-MDM-DEV-ENV";
        const  resourceChar = {} as ResourceCharacteristic;
        resourceChar.name = "premiumValue";
        resourceChar.valueType = "string";
        resourceChar.value = "gold";
        mdmPayLoad.resourceCharacteristic =  [resourceChar];

        const mdmUrl = process.env.MDM_URL.trim()+'/ceda-api/ResourceActivationAndConfiguration/v4/resource';
        this.logger.log(`[doPOST] mdm url is : ${mdmUrl}`);

        const mdmCreateResource = this.httpService.axiosRef.post(mdmUrl,mdmPayLoad);
        mdmCreateResource.then((result)=>{
            this.logger.log(`${result.status} ${result.statusText}`); 
            let createResourceResponse:CreateResource = result.data.mobileBE as CreateResource; 
            this.logger.log(`createResourceResponse ===> :${JSON.stringify(createResourceResponse)}`);
            this.logger.log(`createResourceResponse.href ===> :${JSON.stringify(createResourceResponse.href)}`);
            this.logger.log(`createResourceResponse.id ===> :${JSON.stringify(createResourceResponse.id)}`);
            this.mdmID = createResourceResponse.id;
        }).catch((error)=>{
            this.logger.log(`createResourceResponse error : ${error}`);   
        })
      }
    
   
    beforeApplicationShutdown(signal: string) { 
        this.logger.log(`Yyy. The mobile-backend-instance-${process.env.CONSUMER_GROUP_ID} recieve ${signal} signal for shutdown.`);
        if(this.mdmID != null && this.mdmID.trim() !=''){
            const mdmUrl = process.env.MDM_URL.trim()+'/ceda-api/ResourceActivationAndConfiguration/v4/resource/'+this.mdmID;
            this.logger.log(`[doDELETE] mdm url is : ${mdmUrl}`);

            const mdmDeleteResource = this.httpService.axiosRef.delete(mdmUrl);
            mdmDeleteResource.then((result)=>{
                this.logger.log(`${result.status} ${result.statusText}`); 
                this.logger.log(`deleteResourceResponse ===> :${JSON.stringify(result.data)}`);
            }).catch((error)=>{
                this.logger.log(`deleteResourceResponse error : ${error}`);   
            })
            
        }
    }
    onApplicationShutdown(signal: string){
        this.logger.log(`Zzz. The mobile-backend-instance-${process.env.CONSUMER_GROUP_ID} recieve ${signal} signal has been shutdown.`);
    }
}
