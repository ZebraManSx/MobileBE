import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class WebSocketService {
  public server: Server | undefined;
  
  private socketData = null;
  
  public pushSocketData(key: string,value:String){
    if(this.socketData==null){
      this.socketData = new Map();
    }
    this.socketData.set(key,value);
  }

  public getSocketData(key: string): string{
    if(this.socketData==null){
      return null;
    }
    if(this.socketData.has(key)){
      return this.socketData.get(key);
    }else{
      return null;
    }
  }

  public deleteSocketData(key: string){
    if(this.socketData.has(key)){
      return this.socketData.delete(key);
    }
  }
 
}
