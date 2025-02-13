import { Component, OnDestroy } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list'
import { MessageComponent } from '../message/message.component';
import {MatButtonModule} from '@angular/material/button'
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav'
import { FileviewerComponent } from '../fileviewer/fileviewer.component';
import { Subscription, take } from 'rxjs';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [MatGridListModule, MessageComponent, MatButtonModule, MatSidenavModule, FileviewerComponent, KeyValuePipe],


  template: `

  <mat-drawer-container>

    <mat-drawer #drawer class="example-sidenav" mode="side" position="end">
      <app-fileviewer [selected]="selected" ></app-fileviewer>
    </mat-drawer>

    <div class="example-sidenav-content">
      <mat-grid-list cols="1" rowHeight="2rem"> 
        @for (message of messages | keyvalue; track message.key;){
          <mat-grid-tile [class.selected]="selected === message.key" class="messageItem" (click)="toggleSelected(drawer, message.key, $event)" [colspan]="1" rowspan="1">
          <app-message [message]=message.value ></app-message>
        </mat-grid-tile>
        }
      </mat-grid-list>
    </div>
  </mat-drawer-container>
  `,
  
  styles: `

    .example-sidenav-content{
      min-height: 100vh;
    }

    .messageItem:nth-child(even){
      background-color: #fdfdfd;
    }

    .messageItem:nth-child(odd){
      background-color: #f0f1ef;
    }

    
    ::ng-deep .mat-grid-tile-content{
      border-bottom: 0.1rem #27374D solid;
      justify-content: left !important;
      padding-left: 0.8rem !important; 
    }

    ::ng-deep .mat-grid-tile{
      overflow: visible !important;
    }

   

    .messageItem:hover{
      background-color: #DDE6ED;

    }

    .selected{
      background-color: #9DB2BF !important;
    }
  
    .example-sidenav{
      width: 60%;
    }
  `
})


export class DashboardComponent implements OnDestroy {
  messages: Map<string, string> = new Map<string, string>([
    ["http://localhost:9000/files/303090-3241/100mb.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=4813431dabcd5dad86537a93f18edb4154f26f4907475fcbd6b7e4023b80ef68", "100mb.zip"],
    ["http://localhost:9000/files/303090-3241/filebomb.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=7fdbca4cfe236beeaf570e994d2f7d21d825395944e8438f35b51e23d2f33d55", "filebomb.zip"],
    ["http://localhost:9000/files/303090-3241/HEJ%20powerpoint.pptx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=0f9aecaa714661a74856f2fd19b2357aab3d5d7bc3c18fafe63f375938cec2c7", "HEJ powerpoint.pptx"],
    ["http://localhost:9000/files/303090-3241/Postklient.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=9824cc0619e1f7473d1c1f023661ae08bcee29bec949fec2122d1056746a5eba", "Postklient.svg"],
    ["http://localhost:9000/files/303090-3241/its.working.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=8b92dc4720d1818eaeec074802f20ef81b08bcf54e1381249de16d69bf4d3bcf", "its.working.txt"],
    ["http://localhost:9000/files/303090-3241/lars.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=45b8c4b91166605d33899ef51870bef3d868701662c228754a5f64df53320a9c", "lars.zip"],
    ["http://localhost:9000/files/303090-3241/10mb.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=2c60b5912f6d61748d732f5bb8e3eb2d103dccf93fb44a1dbe1f75b6fec47618", "10mb.zip"],
    ["http://localhost:9000/files/303090-3241/25mb.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=33493bda4a589e5a7364c50f09d809aecbc49cbd18b5e4d36d147105c86aa4f5", "25mb.zip"],
    ["http://localhost:9000/files/303090-3241/99mb.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=97a3825168f86f590d7d58179503c9ce9e41c5848146c71847ab3812bd0b4852", "99mb.zip"],
    ["http://localhost:9000/files/303090-3241/its.workingThree.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=e12c7549ca82f124860bd6bb814ebcffddf69bb57b594445e17e6f522f994e70", "its.workingThree.txt"],
    ["http://localhost:9000/files/303090-3241/its.workingTwo.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=fae420196dbd30ca068b2c516c2ddbf3667d723908b98c30c4e79d4ca6ffcaf6", "its.workingTwo.txt"],
    ["http://localhost:9000/files/303090-3241/t.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=48ed5071b4dc25bc1df60760f4c8c5e1fd637ab89c819dd898b05f6c0386dc29", "t.txt"],
    ["http://localhost:9000/files/303090-3241/49mb.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=99b6177c41b3984e76df11fa286ed0d171654a460f15872636d710b7873a8814", "49mb.zip"],
    ["http://localhost:9000/files/303090-3241/Beemoviescript.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250213T143403Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=59666e07922d2e4a39bda4cb83a77744bc0a72c90773d0a803f9d2e399f9471d","Beemoviescript.pdf"]
]);


  selected: string = "";
  drawerSubscription: Subscription | null = null;


  ngOnDestroy(): void {
    if (this.drawerSubscription) {
      this.drawerSubscription.unsubscribe();
    }
  }

  toggleSelected(drawer: MatDrawer, message: string, event: Event){
    if(this.drawerSubscription){
      this.drawerSubscription.unsubscribe();
      this.drawerSubscription = null;
    }


    if(drawer.opened && message !== this.selected){
      drawer.close();
      this.drawerSubscription = drawer._animationEnd.pipe(
        take(1)
      ).subscribe((_) => {
        this.selected = message;
        drawer.open();
        console.log("drawer opened and "+ message+ " !== "+this.selected+", and should close and open "+message);
      })
    
    }else if(drawer.opened && message === this.selected){
      this.selected = "";
      console.log("drawer opened and "+ message +" === "+this.selected+", and should close");
      drawer.close();

    }else {
      this.selected = message;
      console.log(this.selected);
      drawer.open();
    }

  }


}
