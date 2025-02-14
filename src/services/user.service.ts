import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  APIURL = "http://localhost:8080/user"
  loggedInUser$: BehaviorSubject<User> = new BehaviorSubject<User>({id: "", cpr: "", fileLinks: []});

  constructor(private http:HttpClient) { }

  getUser(cpr:string): Observable<User>{
    return this.http.get<User>(this.APIURL+"/"+cpr)
  }

  get getLoggedInUser(){
    return this.loggedInUser$.asObservable();
  }

  set setLoggedInUser(user:User){
    this.loggedInUser$.next(user);
  }

}
