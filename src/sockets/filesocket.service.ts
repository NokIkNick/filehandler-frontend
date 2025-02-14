import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UploadProgress } from '../interfaces/upload-progress';

@Injectable({
  providedIn: 'root'
})
export class FilesocketService {
  private webSocket!: WebSocket;
  socketURL:string = `ws://localhost:8080/upload-progress/`
  backendMessages = new Subject<UploadProgress>();
  public backendMessages$ = this.backendMessages.asObservable();


  //{"fileName":"25mb.zip","uploadedParts":1, "totalParts":4, "percentage":25.0}

  buildMessage(message: string) : UploadProgress{
      return JSON.parse(message);
  }

  constructor() {}

  connect(cpr: string): void{
    console.log("Connectiing to socket");
    this.webSocket = new WebSocket(this.socketURL+cpr);
    console.log("Connected to socket", this.webSocket.OPEN);

    this.webSocket.onmessage = (event) => {
      const message = this.buildMessage(event.data);
      this.backendMessages.next(message);
    }

    this.webSocket.onclose = () => {
      console.log("Socket closed!");
    }

    this.webSocket.onerror = (error) => {
      console.log("Socket error", error);
    }
  }

  disconnect():void {
    if(this.webSocket){
      this.webSocket.close;
    }
  }

  
}
