import { Component } from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatIconModule} from '@angular/material/icon'
import { FileuploadComponent } from '../fileupload/fileupload.component';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule],
  template: `
    <footer class="footer">
      <div class="button-container">
        <button mat-mini-fab (click)="openPanel()" class="panel-toggle"> 
          <h5>Upload file </h5>
        </button>
      </div>
    </footer>
  
  `,
  styles: `
  .footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #f5f5f5;
      display: flex;
      justify-content: right;
      z-index: 1;
    }

    .panel-toggle {
      position: relative;
      bottom: 8px;
    }

    .centered-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      margin: 0;
    }

    .button-container {
      position: relative;
      display: flex;
      justify-content: center;
      margin-top: -32px;
      margin-right: 1rem;
    }
  
  `
})
export class FooterComponent {
  constructor(private bottomSheet: MatBottomSheet){

  }

  openPanel(){
    this.bottomSheet.open(FileuploadComponent, {
      hasBackdrop: false,
      disableClose: false,
    })


  }

}
