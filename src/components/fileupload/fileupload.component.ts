import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import {NgxFileDropEntry, NgxFileDropModule} from 'ngx-file-drop';
import { lastValueFrom } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-fileupload',
  imports: [MatIconModule, MatIconButton, NgxFileDropModule],
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
              @for (file of files; track file) {
                <tr>
                  <td>
                    <strong>
                      {{file.relativePath}}
                    </strong> 
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
export class FileuploadComponent {
  files: NgxFileDropEntry[] = [];
  
  constructor(private bottomSheetRef: MatBottomSheetRef<FileuploadComponent>, private fileService: FileService){

  }

  public dropped(files: NgxFileDropEntry[]){
    this.files = files;

    for(const droppedFile of files){

      
      if(droppedFile.fileEntry.isFile){
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file:File) => {

          
          const formData = new FormData();
          formData.append('file', file)
          formData.append('fileName', file.name)
          

          const fileExtension = file.name.substring(file.name.lastIndexOf("."));
          const contentType = this.findContentType(fileExtension);

          
          const headers = new HttpHeaders({
            'Content-Type': contentType
          });

          formData.append('Content-Type', contentType);
          
          this.fileService.uploadFile(formData, "303090-3241").subscribe((x) => {
            console.log(x);
          })

        });
      }else {
        //if it wasnt a file, it could've been an empty directory
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: Event){
    console.log(event);
  }

  public fileLeave(event: Event){
    console.log(event);
  }


  findContentType(extension: string){
    let contentType: string;
    switch(extension){
      case ".txt":
        contentType = "text/plain";
        break;
      case ".pdf":
        contentType = "application/pdf";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".html":
        contentType = "text/html";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".js":
        contentType = "application/javascript";
        break;
      case ".xml":
        contentType = "application/xml";
        break;
      case ".csv":
        contentType = "text/csv";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
      case ".mp3":
        contentType = "audio/mpeg";
        break;
      case ".wav":
        contentType = "audio/wav";
        break;
      case ".mp4":
        contentType = "video/mp4";
        break;
      case ".avi":
        contentType = "video/x-msvideo";
        break;
      case ".mov":
        contentType = "video/quicktime";
        break;
      case ".zip":
        contentType = "application/zip";
        break;
      case ".rar":
        contentType = "application/vnd.rar";
        break;
      case ".tar":
        contentType = "application/x-tar";
        break;
      case ".gz":
        contentType = "application/gzip";
        break;
      case ".doc":
        contentType = "application/msword";
        break;
      case ".docx":
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case ".xls":
        contentType = "application/vnd.ms-excel";
        break;
      case ".xlsx":
        contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
      case ".ppt":
        contentType = "application/vnd.ms-powerpoint";
        break;
      case ".pptx":
        contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        break;
      case ".odt":
        contentType = "application/vnd.oasis.opendocument.text";
        break;
      case ".ods":
        contentType = "application/vnd.oasis.opendocument.spreadsheet";
        break;
      case ".odp":
        contentType = "application/vnd.oasis.opendocument.presentation";
        break;
      default:
        contentType = "application/octet-stream";
        break;
    }
    return contentType;
}


  closePanel(){
    this.bottomSheetRef.dismiss();
  }


}
