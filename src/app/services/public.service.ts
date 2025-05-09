import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Message } from '../model/message/messageDTO';
import { userReadDto } from '../model/user/userReadDTO';
import { loginDto } from '../model/user/LoginDTO';
import { Observable } from 'rxjs';
import { userProfileDto } from '../model/user/userProfileDTO';


@Injectable({
  providedIn: 'root'
})
export class PublicService {

  private apiURL= "http://localhost:8080/api/public"
  constructor(private http: HttpClient) {}

  getUsuarioById(id: number): Observable<Message<userProfileDto>> {
    return this.http.get<Message<userProfileDto>>(`${this.apiURL}/obtener-usuario/${id}`);
  }


}
