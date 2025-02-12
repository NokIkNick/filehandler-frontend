import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  APIURL:string = "http://localhost:8080/files"

  constructor(private http: HttpClient) { 

  }

  uploadFile(file: FormData, cpr:string): Observable<any> {
    return this.http.post(this.APIURL+"/"+cpr+"/upload", file, {responseType: 'text'})
  }

}
