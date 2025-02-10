import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list'
import { MessageComponent } from '../message/message.component';
import {MatButtonModule} from '@angular/material/button'
import {MatSidenavModule} from '@angular/material/sidenav'

@Component({
  selector: 'app-dashboard',
  imports: [MatGridListModule, MessageComponent, MatButtonModule, MatSidenavModule],


  template: `

  <mat-drawer-container>

    <mat-drawer #drawer class="example-sidenav" mode="side" position="end">
      <p>Hello</p>
    </mat-drawer>

    <div class="example-sidenav-content">
      <mat-grid-list cols="1" rowHeight="3rem"> 
        @for (message of messages; track message){
          <mat-grid-tile class="messageItem" (click)="drawer.toggle()" [colspan]="1" rowspan="1">
          <app-message [message]=message ></app-message>
        </mat-grid-tile>
        }
      </mat-grid-list>
    </div>
  </mat-drawer-container>
  `,
  
  styles: `

    .messageItem{
      background-color: lightgrey;
    }

    .messageItem:hover{
      background-color: grey;
    }
  
  `
})


export class DashboardComponent {
  messages: string[] = [
  "Important: Meeting Schedule Change",
  "Reminder: Documentation Review Deadline Approaching",
  "Urgent Action Needed: System Maintenance Update",
  "Notification: New Policy Implementation",
  "Alert: Case Status Update Required",
  "Reminder: Monthly Reporting Due Soon",
  "Update: Changes to Submission Guidelines",
  "Action Required: Review of Latest Findings",
  "Follow-up: Outstanding Task Reminders",
  "Notice: Upcoming Deadline for Case Review",
  "Urgent: Immediate Approval Needed for Request",
  "Update: Pending Action on Recent Case",
  "Reminder: Review Your Pending Assignments",
  "New Information: Upcoming Case Discussions",
  "Action Needed: Review of Legal Documents"
  ]

}
