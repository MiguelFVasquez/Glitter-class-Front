import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Message } from '../model/message/messageDTO';
import { Observable } from 'rxjs';
import { readExam } from '../model/exam/readExamDto';
import { createExam } from '../model/exam/createExamDto';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private apiURL= "http://localhost:8080/api/examen"
  constructor(private http: HttpClient) {}


  //Method to get all professor exams
  getExams(idProfessor:number): Observable<Message<readExam[]>>{
      return this.http.get<Message<readExam[]>>(`${this.apiURL}/listar-examenes-docente/${idProfessor}`);
  }
  //Method to create a exam, return an id
  createExam(newExamen:createExam):Observable<Message>{
    return this.http.post<Message>(`${this.apiURL}/crear-examen`,newExamen);
  }


}
