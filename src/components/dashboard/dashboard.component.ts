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
    ["http://localhost:9000/files/303090-3241/cool.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250212%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250212T111451Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=24f7176d39162034ace9fd0566b973493a538888ddd53d06152de106367d857f", "cool.txt"],
    ["http://localhost:9000/files/303090-3241/HEJ%20powerpoint.pptx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250212%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250212T111451Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=f8ed384a054f16906b5edee036486d8a64ae7a8de15c10bd68e33c4dc05115ac", "HEJ powerpoint.pptx"],
    ["http://localhost:9000/files/303090-3241/Postklient.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250212%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250212T111451Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=ab64d98c6c38c992488458155fac59d07966cf0fa385a5cb7cdaca2161e9f6bc", "Postklient.svg"],
    ["http://localhost:9000/files/303090-3241/mysql.sql?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250212%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250212T111451Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=690842d1df995c5c6080d0e5e9c3f75ec480d5238229ab8d555175c3efd6044b", "mysql.sql"],
    ["http://localhost:9000/files/303090-3241/Beemoviescript.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250212%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250212T111451Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=8e7e07dfe91c08fa19366c6b239119a500ac6912b330cc27dcddf6953cc15b98", "Beemoviescript.pdf"],
    ["http://localhost:9000/files/303090-3241/Beemoviescript.docx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=q7cyQ6xuheSmumyeO7El%2F20250212%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250212T111451Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=cb1bfc5b69360cea9227f616b3daddbd0552747b732184dbf907c7f2c9cff300", "Beemoviescript.docx"]
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
