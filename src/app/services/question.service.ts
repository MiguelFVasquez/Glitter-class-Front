import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Message } from '../model/message/messageDTO';
import { Observable } from 'rxjs';
import { readPublicQuestion } from '../model/questions/readQuestionDto';
import { createQuestion } from '../model/questions/createQuestionDto';
import { createOption } from '../model/questions/createOptionDto';
import { optionCreated } from '../model/questions/optionReadDto';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiURL= "http://localhost:8080/api/pregunta"
  constructor(private http: HttpClient) {}

    //------------Questions--------------
  
  //Method to get all professor questions
  getQuestions(id:number):Observable<Message<readPublicQuestion[]>>{
    return this.http.get<Message<readPublicQuestion[]>>(`${this.apiURL}/obtener-preguntas-docente/${id}`);
  }
  //Method to get all professor questions and filter per theme
  getQuestionsByDocenteAndTheme(idUsuario:number, idTheme:number):Observable<Message<readPublicQuestion[]>>{
    return this.http.get<Message<readPublicQuestion[]>>(`${this.apiURL}/obtener-preguntas-docente-tema/${idUsuario}/${idTheme}`);
  }

  getQuestionByTheme(idTheme:number):Observable<Message<readPublicQuestion[]>>{
    return this.http.get<Message<readPublicQuestion[]>>(`${this.apiURL}/obtener-preguntas-tema/${idTheme}`);
  }
  //Method to create a question
  createQuestion(question:createQuestion):Observable<Message>{
    return this.http.post<Message>(`${this.apiURL}/crear-pregunta`,question);
  }

  //Method to create option
  createOption(idQuestion:number, option:createOption): Observable<Message<optionCreated>>{
    return this.http.post<Message<optionCreated>>(`${this.apiURL}/crear-opcion/${idQuestion}`,option);
  }

}