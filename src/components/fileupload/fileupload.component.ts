import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import {NgxFileDropEntry, NgxFileDropModule} from 'ngx-file-drop';
import { lastValueFrom, Subscription } from 'rxjs';
import { HttpEventType, HttpHeaders } from '@angular/common/http';
import { FileService } from '../../services/file.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FileProgress } from '../../interfaces/file-progress';
import { FilesocketService } from '../../sockets/filesocket.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-fileupload',
  imports: [MatIconModule, MatIconButton, NgxFileDropModule, MatProgressBarModule],
  template: `
    <div class="panel-content">
      <div class="panel-header">
        <button mat-icon-button class="close-button" (click)="closePanel()">
          <mat-icon class="centered-icon">keyboard_arrow_down</mat-icon>
        </button>
      </div>
      <div class="panel-body">
        <ngx-file-drop dropZoneLabel="Drop files here" (onFileDrop)="dropped($event)" (onFileOver)="fileOver($event)" (onFileLeave)="fileLeave($event)">
          <ng-template ngx-file-drop-content-tmp let-openFileSelector="openFileSelector">
            <button type="button" (click)="openFileSelector()">Browse Files</button>
          </ng-template>
        </ngx-file-drop>

        

        <div class="upload-table">
          <table class="table">
            <tbody class="upload-name-style">
              @for (file of fileProgresses; track file) {
                  <tr>
                  <td>
                    <strong>
                      {{file.status}}
                    </strong>
                    <mat-progress-bar mode="determinate" [value]="file.progress"></mat-progress-bar> 
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `,
  styles: `

    
    .panel-content {
      padding: 16px;
      background: white;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      box-shadow: 0px -2px 8px rgba(0,0,0,0.1);
    }

    .panel-header {
      display: flex;
      justify-content: center;
      margin: -32px 0 16px 0;
    }

    .close-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
    }

    .centered-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      margin: 0;
    }

    .panel-body {
      padding: 0 16px;
    }
  
  `
})
export class FileuploadComponent implements OnInit, OnDestroy {
  files: NgxFileDropEntry[] = [];
  fileProgresses: FileProgress[] = [];
  uploadProgess: number = 0;
  uploadStatus?: string;
  loggedInUser$?: Subscription
  loggedInUser?: User;
  backEndMessages$?: Subscription;
  backEndMessage: string = "";

  constructor(private bottomSheetRef: MatBottomSheetRef<FileuploadComponent>, private fileService: FileService, private fileSocket:FilesocketService, private userService: UserService){
    
  }
  
  ngOnInit(): void {
    this.subToUser();
    
  }

  ngOnDestroy(): void {
    this.unSubToUser();
    this.unSubToBackendMessages();
  }

  subToUser(){
    this.loggedInUser$ = this.userService.getLoggedInUser.subscribe((user) => {
      console.log(user);
      
      if(user){
        this.loggedInUser = user;
        this.fileSocket.connect(user.cpr);
        this.subToBackendMessages();
      }
    })
  }

  unSubToUser(){
    this.loggedInUser$?.unsubscribe();
  }

  subToBackendMessages(){
    this.backEndMessages$ = this.fileSocket.backendMessages$.subscribe((x) => {
      this.backEndMessage = x.percentage.toString();
      console.log(this.backEndMessage);
      
    })
  }

  unSubToBackendMessages(){
    this.backEndMessages$?.unsubscribe();
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.fileProgresses = files.map(file => ({
      file,
      progress: 0,
      status: 'Starting upload...'
    }));

    files.forEach((droppedFile, i) => {

      if (droppedFile.fileEntry.isFile) {

        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        
        fileEntry.file((file: File) => {

          const formData = new FormData();
          formData.append('file', file);
          formData.append('fileName', file.name);
          formData.append('fileSize', file.size.toString());

          this.fileService.uploadFile(formData, "303090-3241").subscribe({
            next: (event) =>{
            if (event.type === HttpEventType.UploadProgress) {

              const percentDone = Math.round(100 * event.loaded / event.total!);
              this.fileProgresses[i].progress = percentDone;

              console.log(this.fileProgresses[i].progress);
              

              this.fileProgresses[i].status = percentDone === 100 
                ? `Successfully uploaded ${file.name}`
                : 'Uploading file...';
            }
          },
          error: (error) => {
            this.fileProgresses[i].status = `Failed to upload ${file.name}: ${error.message}`
          }
        });
      }
    )}
  }
)
}

  public fileOver(event: Event){
    
  }

  public fileLeave(event: Event){
    
  }


  closePanel(){
    this.bottomSheetRef.dismiss();
  }


}
