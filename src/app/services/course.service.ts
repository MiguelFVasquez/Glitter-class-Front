import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Message } from '../model/message/messageDTO';
import { Observable } from 'rxjs';
import { CourseDto } from '../model/courses/courseDto';
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiURL= "http://localhost:8080/api/courses"
  constructor(private http: HttpClient) {}

  getCourseById(id: number): Observable<Message<CourseDto>> {
    return this.http.get<Message<CourseDto>>(`${this.apiURL}/cursos/${id}`);
  }
  
}
