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
export class AuthService {

  private apiURL= "http://localhost:8080/api/autorizacion"
  constructor(private http: HttpClient) {}



  login(login: loginDto): Observable<userReadDto> {
    return this.http.post<userReadDto>(`${this.apiURL}/login`, login);
  }

  getUsuarioById(id: number): Observable<Message<userProfileDto>> {
  return this.http.get<Message<userProfileDto>>(`${this.apiURL}/obtener-usuario/${id}`);
}


}
