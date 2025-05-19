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
import { unidadAcademica } from '../model/enums/unidadDto';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  private apiURL= "http://localhost:8080/api/public"
  constructor(private http: HttpClient) {}

  getUsuarioById(id: number): Observable<Message<userProfileDto>> {
    return this.http.get<Message<userProfileDto>>(`${this.apiURL}/obtener-usuario/${id}`);
  }
  //-------------ENUMS-------------
  //Method to get all categories, are like the theme of the question
  getTemas():Observable<Message<categoria[]>>{
    return this.http.get<Message<categoria[]>>(`${this.apiURL}/obtener-temas`);
  }
  //Method to get all dificulties of the questions
  getDificultades():Observable<Message<dificultad[]>>{
    return this.http.get<Message<dificultad[]>>(`${this.apiURL}/obtener-dificultades`);
  }
  //Method to get all types of questions
  getTiposPregunta(): Observable<Message<tipoPregunta[]>>{
    return this.http.get<Message<tipoPregunta[]>>(`${this.apiURL}/obtener-tipos`);
  }

  getUnidades(): Observable<Message<unidadAcademica[]>>{
    return this.http.get<Message<unidadAcademica[]>>(`${this.apiURL}/obtener-unidades`);
  }

  //Get professor unities
  getProfessorUnities(id:number): Observable<Message<unidadAcademica[]>>{
    return this.http.get<Message<unidadAcademica[]>>(`${this.apiURL}/obtener-unidades-docente/${id} `);
  }

  getVisibility(): Observable<Message<visibility[]>>{
    return this.http.get<Message<visibility[]>>(`${this.apiURL}/obtener-visibilidades`);
  }
  //--------COURSES-------------
  //Method to get all cuourses
  getCursos():Observable<Message<CourseDto[]>>{
    return this.http.get<Message<CourseDto[]>>(`${this.apiURL}/obtener-cursos`);
  }
  //Method to get the professor courses,
  getCoursesToProfessor(id: number): Observable<Message<CourseDto[]>> {
    return this.http.get<Message<CourseDto[]>>(`${this.apiURL}/cursos-docente/${id}`);
  }
  //Method to get the student courses
  getCoursesToStudent(id: number): Observable<Message<CourseDto[]>> {
    return this.http.get<Message<CourseDto[]>>(`${this.apiURL}/cursos-estudiante/${id}`);
  }

  //------------Questions--------------
  getPublicQuestions():Observable<Message<readPublicQuestion[]>>{
    return this.http.get<Message<readPublicQuestion[]>>(`${this.apiURL}/obtener-preguntas-publicas`);
  }
  //-----------Exams-------------------
  getExams():Observable<Message<readExam[]>>{
    return this.http.get<Message<readExam[]>>(`${this.apiURL}/obtener-examenes`);
  }

}
