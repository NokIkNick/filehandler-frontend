import { Component, OnDestroy } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list'
import { MessageComponent } from '../message/message.component';
import {MatButtonModule} from '@angular/material/button'
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav'
import { FileviewerComponent } from '../fileviewer/fileviewer.component';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [MatGridListModule, MessageComponent, MatButtonModule, MatSidenavModule, FileviewerComponent],


  template: `

  <mat-drawer-container>

    <mat-drawer #drawer class="example-sidenav" mode="side" position="end">
      <app-fileviewer [selected]="selected" ></app-fileviewer>
    </mat-drawer>

    <div class="example-sidenav-content">
      <mat-grid-list cols="1" rowHeight="2rem"> 
        @for (message of messages; track message){
          <mat-grid-tile [class.selected]="selected === message" class="messageItem" (click)="toggleSelected(drawer, message, $event)" [colspan]="1" rowspan="1">
          <app-message [message]=message ></app-message>
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
  messages: string[] = [
    "document_2025.docx",
    "image_14.png",
    "script_final.js",
    "notes.txt",
    "presentation_v3.pptx",
    "data_backup.sql",
    "invoice_783.pdf",
    "archive.zip",
    "music_track.mp3",
    "spreadsheet.xlsx",
    "report_final.docx",
    "diagram_42.svg",
    "log_20240211.log",
    "backup_01.tar",
    "configuration.yaml"
  ];

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
