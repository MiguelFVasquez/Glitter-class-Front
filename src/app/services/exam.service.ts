import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Message } from '../model/message/messageDTO';
import { Observable } from 'rxjs';
import { readExam } from '../model/exam/readExamDto';
import { createExam, preguntaExamenDto } from '../model/exam/createExamDto';
import { createdExam } from '../model/exam/createdExamDto';
import { groupExam } from '../model/exam/groupExamDto';
import { cantidadPreguntas } from '../model/exam/cantidadPreguntasDto';
import { DetalleExamenDto, PreguntaOpcionesExamenDto } from '../model/exam/examDetailDto';

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
  createExam(newExamen:createExam):Observable<Message<createdExam>>{
    return this.http.post<Message<createdExam>>(`${this.apiURL}/crear-examen`,newExamen);
  }

  // exam.service.ts
  addQuestion(idExam: number, idPregunta: number): Observable<Message<number>> {
    return this.http.post<Message<number>>(`${this.apiURL}/agregar-pregunta-examen/${idExam}/${idPregunta}`,{});
  }
  //Method to get all group exams
  getGroupExam (idGroup: number): Observable<Message<groupExam[]>>{
    return this.http.get<Message<groupExam[]>>(`${this.apiURL}/listar-examenes-grupo/${idGroup}`);
  }

  //Send total questions to the back
  actualizarCantidadPreguntas(cantidades: cantidadPreguntas): Observable<Message<Record<string, any>>> {
    return this.http.post<Message<Record<string, any>>>(
      `${this.apiURL}/actualizar-cantidad-preguntas`,
      cantidades
    );
  }

  //--------------Examen del estudiante-------------
  getDetailExam(idExam:number, idEstudiante:number): Observable<Message<PreguntaOpcionesExamenDto[]>>{
    return this.http.get<Message<PreguntaOpcionesExamenDto[]>>(`${this.apiURL}/obtener-examen-estudiante/${idExam}/${idEstudiante}`);
  }
  generarExamenEstudiante(idExamen: number, idEstudiante: number): Observable<Message<number>> {
  return this.http.post<Message<number>>(
    `${this.apiURL}/generar-examen-estudiante/${idExamen}/${idEstudiante}`, {}
  );
}


}
