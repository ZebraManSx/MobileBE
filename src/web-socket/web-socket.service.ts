import { Injectable } from '@nestjs/common';
import { rejects } from 'assert';
import { resolve } from 'path';
import { Server } from 'socket.io';
import { resourceLimits } from 'worker_threads';

@Injectable()
export class WebSocketService {
  public server: Server | undefined;
  
  private socketData = null;
  
  public async pushSocketData(key: string,value:String){
    if(this.socketData==null){
      this.socketData = new Map();
    }
    await this.socketData.set(key,value);
    console.log(`[store] pushSocketData ${key} = ${value} done.`)
  }

  public async getSocketData(key: string): Promise<string>{
    return new Promise((resolve,reject)=>{
        if(!this.socketData){
          reject('store is null...')
        }else{
          if(this.socketData.has(key)){
            resolve(this.socketData.get(key))
          }else{
            reject(`key ${key} in store not found...`)
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
