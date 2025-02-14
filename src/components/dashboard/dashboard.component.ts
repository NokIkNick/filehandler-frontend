import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list'
import { MessageComponent } from '../message/message.component';
import {MatButtonModule} from '@angular/material/button'
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav'
import { FileviewerComponent } from '../fileviewer/fileviewer.component';
import { forkJoin, Observable, Subscription, take } from 'rxjs';
import { KeyValuePipe } from '@angular/common';
import { FileService } from '../../services/file.service';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

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
        @for (message of messages; track message;){
          <mat-grid-tile [class.selected]="selected === message" class="messageItem" (click)="toggleSelected(drawer, message, $event)" [colspan]="1" rowspan="1">
          <app-message [message]=message></app-message>
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


export class DashboardComponent implements OnDestroy, OnInit {
  userCPR = "303090-3241"
  messages: string[] = [];
  selected?: string;
  previousSelected?: string;
  drawerSubscription: Subscription | null = null;
  fileNames$?: Subscription;
  loggedInUser?: User;
  loggedInUser$?: Subscription;
  
  constructor(private fileService:FileService, private userService:UserService){

  }

  ngOnInit(): void {
    this.subToFileNames();
    this.subToUser();

    forkJoin({
      user: this.getUser(this.userCPR),
    }).subscribe(({user}) => {
      this.loggedInUser = user;
      this.userService.setLoggedInUser = user;
      this.getFileNames(user);
      
    })
  }

  ngOnDestroy(): void {
    if (this.drawerSubscription) {
      this.drawerSubscription.unsubscribe();
    }
    this.unsubToFileNames();
  }

  getFileNames(user: User){
    this.fileService.getFileNames(user.cpr).subscribe((names) => {
        this.fileService.setAllFileNames = names;
    })
  }

  getFile(cpr:string, fileName:string){
    this.fileService.getFileLink(cpr, fileName).subscribe((link) => {
      console.log(link);
      this.selected = link;
      this.previousSelected = fileName;
    });
  }

  subToFileNames() {
    this.fileNames$ = this.fileService.getAllFileNames.subscribe((x) => {
      this.messages = x;
    });
  }

  unsubToFileNames() {
    this.fileNames$?.unsubscribe();
  }

  getUser(cpr: string) : Observable<User>{
    return this.userService.getUser(cpr);
  }

  subToUser(){
    this.loggedInUser$ = this.userService.getLoggedInUser.subscribe((user) => {
      this.loggedInUser =user;
    })
  }

  unSubToUser(){
    this.loggedInUser$?.unsubscribe();
  }


  toggleSelected(drawer: MatDrawer, message: string, event: Event){
    if(this.drawerSubscription){
      this.drawerSubscription.unsubscribe();
      this.drawerSubscription = null;
    }


    if(drawer.opened && message !== this.previousSelected){
      drawer.close();
      this.drawerSubscription = drawer._animationEnd.pipe(
        take(1)
      ).subscribe((_) => {
        this.getFile(this.loggedInUser!.cpr, message);
        drawer.open();
        console.log("drawer opened and "+ message+ " !== "+this.selected+", and should close and open "+message);
      })
    
    }else if(drawer.opened && message === this.previousSelected){
      this.selected = undefined;
      console.log("drawer opened and "+ message +" === "+this.selected+", and should close");
      drawer.close();

    }else {
      this.getFile(this.loggedInUser!.cpr, message)
      console.log(this.selected);
      drawer.open();
    }

  }


}
