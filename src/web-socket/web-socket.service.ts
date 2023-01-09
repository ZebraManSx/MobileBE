import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class WebSocketService {
  private readonly logger = new Logger(WebSocketService.name);
  public server: Server | undefined;
  
  private socketData = null;
  
  public async pushSocketData(key: string,value:String){
    if(this.socketData==null){
      this.socketData = new Map();
    }
    await this.socketData.set(key,value);
    this.logger.log(`[store] pushSocketData() ${key} = ${value}`)
  }

  public async getSocketData(key: string): Promise<string>{
    return new Promise((resolve,reject)=>{
        if(this.socketData==null){
             reject('[store] getSocketData() store is null|undefined')
        }else{
          if(this.socketData.has(key)){
            resolve(this.socketData.get(key))
          }else{
            reject(`[store] getSocketData() key ${key} not found`)
          } 
        }
    });
  }

  public async deleteSocketData(key: string){
    if(this.socketData.has(key)){
      return this.socketData.delete(key);
    }
  }
 
}
