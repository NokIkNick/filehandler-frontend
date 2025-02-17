import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import {NgxFileDropEntry, NgxFileDropModule} from 'ngx-file-drop';
import { Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { FileService } from '../../services/file.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FileProgress } from '../../interfaces/file-progress';
import { FilesocketService } from '../../sockets/filesocket.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { UploadProgress } from '../../interfaces/upload-progress';
import { DialogService } from '../../services/dialog.service';
import { ImageviewerComponent } from '../imageviewer/imageviewer.component';

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
        <ngx-file-drop dropZoneLabel="Drop files here" (onFileDrop)="dropped($event)">
          <ng-template ngx-file-drop-content-tmp let-openFileSelector="openFileSelector">
            <button type="button" (click)="openFileSelector()">Browse Files</button>
          </ng-template>
        </ngx-file-drop>
        
        

        <div class="upload-table">
          <table class="table">
            <tbody class="upload-name-style">
              @for (file of fileProgresses; track file) {
                <strong>{{file.status}}</strong>
                @if(file.status === "Uploading file..." || file.status === "Starting upload..."){
                <tr>
                  <td>
                    <mat-progress-bar mode="determinate" [value]="file.progress"></mat-progress-bar> 
                  </td>
                </tr>
                }@else if (progressMap.get(file.fileName)?.status === 0) {
                  <tr>
                    <td>
                      <strong>
                        {{"Uploading "+progressMap.get(file.fileName)?.fileName+" to server.."}}
                      </strong>
                      <mat-progress-bar mode="determinate" [value]="progressMap.get(file.fileName)?.percentage"></mat-progress-bar> 
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>
                        {{progressMap.get(file.fileName)?.uploadedParts}}/{{progressMap.get(file.fileName)?.totalParts}}
                      </strong>
                    </td>
                  </tr>
                }@else {
                  <tr>
                    <td>
                      <strong>File upload for {{file.fileName}} completed!</strong>
                    </td>
                  </tr>
                }  
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

    .table{
      min-width: 100%;
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
  progressMap: Map<string, UploadProgress> = new Map<string, UploadProgress>();

  constructor(readonly bottomSheetRef: MatBottomSheetRef<FileuploadComponent>, readonly fileService: FileService, readonly fileSocket:FilesocketService, readonly userService: UserService, readonly dialogService: DialogService){
    
  }
  
  ngOnInit(): void {
    this.subToUser();
    
  }

  ngOnDestroy(): void {
    this.unSubToUser();
    this.unSubToBackendMessages();
    this.fileService.getFileNames(this.loggedInUser?.cpr!).subscribe((names) => {
      this.fileService.setAllFileNames = names;
    });
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
      
      this.progressMap.set(x.fileName, x);

      console.table(this.progressMap);

    })
  }

  unSubToBackendMessages(){
    this.backEndMessages$?.unsubscribe();
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.progressMap = new Map<string, UploadProgress>();

    this.fileProgresses = files.map(file => ({
      file: file,
      fileName: file.fileEntry.name,
      progress: 0,
      status: 'Starting upload...'
    }));

    files.forEach((droppedFile, i) => {

      if (droppedFile.fileEntry.isFile) {

        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        
        fileEntry.file((file: File) => {
          
          const fileSizesInMb = (file.size / 1024 / 1024);
          
          if(fileSizesInMb > 99 ){
            const dialogConfig = {
              data: {
                partAmount: fileSizesInMb 
              }
            };
            this.dialogService.displayDialogWithComponent(ImageviewerComponent, dialogConfig)
          }

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
                ? `Successfully uploaded: ${file.name}, to backend`
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


  closePanel(){
    this.bottomSheetRef.dismiss();
  }


}
