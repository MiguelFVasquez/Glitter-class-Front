import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Message } from '../model/message/messageDTO';
import { Observable } from 'rxjs';
import { userProfileDto } from '../model/user/userProfileDTO';
import {categoria} from '../model/enums/categoriaDto';
import {dificultad} from '../model/enums/dificultadesDto';
import {tipoPregunta} from '../model/enums/tiposPreguntaDto';
import { CourseDto } from '../model/courses/courseDto';
import { visibility } from '../model/enums/visibilidadDto';
import { readPublicQuestion } from '../model/questions/readQuestionDto';
import { readExam } from '../model/exam/readExamDto';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiURL= "http://localhost:8080/api/pregunta"
  constructor(private http: HttpClient) {}

    //------------Questions--------------
  getQuestions(id:number):Observable<Message<readPublicQuestion[]>>{
    return this.http.get<Message<readPublicQuestion[]>>(`${this.apiURL}obtener-preguntas-docente/${id}`);
  }

}