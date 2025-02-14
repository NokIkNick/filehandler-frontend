import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  fileNames$: Subject<string[]> = new Subject;
  APIURL:string = "http://localhost:8080/files"
  

  constructor(private http: HttpClient) { 

  }

  uploadFile(file: FormData, cpr:string) {
    return this.http.post(this.APIURL+"/"+cpr+"/uploadLargeFile", file, {responseType: 'text', reportProgress: true, observe: 'events'});
  }


  getFileNames(cpr:string): Observable<string[]>{
    return this.http.get<string[]>(this.APIURL+"/userFiles/"+cpr)
  }

  getFileLink(cpr:string, fileName:string) : Observable<string> {
    return this.http.get(this.APIURL+"/"+cpr+"/"+fileName, {responseType: 'text'})
  }

  set setAllFileNames(names: string[]){
    this.fileNames$.next(names);
  }

  get getAllFileNames(): Observable<string[]> {
    return this.fileNames$.asObservable();
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

}
