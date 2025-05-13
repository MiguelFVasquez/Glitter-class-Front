import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Message } from '../model/message/messageDTO';
import { userReadDto } from '../model/user/userReadDTO';
import { loginDto } from '../model/user/LoginDTO';
import { Observable } from 'rxjs';
import { userProfileDto } from '../model/user/userProfileDTO';
import {categoria} from '../model/enums/categoriaDto';

import {curso} from '../model/enums/cursoDto';
import {dificultad} from '../model/enums/dificultadesDto';
import {tipoPregunta} from '../model/enums/tiposPreguntaDto';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  private apiURL= "http://localhost:8080/api/public"
  constructor(private http: HttpClient) {}

  getUsuarioById(id: number): Observable<Message<userProfileDto>> {
    return this.http.get<Message<userProfileDto>>(`${this.apiURL}/obtener-usuario/${id}`);
  }
  //Method to get all categories, are like the theme of the question
  getCategorias():Observable<Message<categoria[]>>{
    return this.http.get<Message<categoria[]>>(`${this.apiURL}/obtener-categorias`);
  }
  //Method to get all cuourses
  getCursos():Observable<Message<curso[]>>{
    return this.http.get<Message<curso[]>>(`${this.apiURL}/obtener-cursos`);
  }
  //Method to get all dificulties of the questions
  getDificultades():Observable<Message<dificultad[]>>{
    return this.http.get<Message<dificultad[]>>(`${this.apiURL}/obtener-dificultades`);
  }
  //Method to get all types of questions
  getTiposPregunta(): Observable<Message<tipoPregunta[]>>{
    return this.http.get<Message<tipoPregunta[]>>(`${this.apiURL}/obtener-tipos`);
  }
}
