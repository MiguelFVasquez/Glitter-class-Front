import { Component, OnInit } from '@angular/core';
import { CursosCardComponent } from '../cursos-card/cursos-card.component';
import { CommonModule } from '@angular/common';
import { PublicService } from '../../services/public.service';
import { StorageService } from '../../services/storage.service';
import { CourseDto } from '../../model/courses/courseDto';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CursosCardComponent, CommonModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit{
  courses: CourseDto[]= [];

  constructor(private publicService:PublicService,private storageService: StorageService){}

  ngOnInit(): void {
    this.loadCourses();
  }
  

  loadCourses(){
    const idUsuario: number = Number(this.storageService.get('idUsuario'));
    const idRol: number = Number(this.storageService.getUserRole());
    
    if (idRol==1) { //If currently rol is studen we get all courses from this student
      this.publicService.getCoursesToStudent(idUsuario).subscribe({
        next: (response) => {
          if (!response.error) {
            this.courses = response.respuesta;
          } else {
            console.error('Error en la respuesta del backend');
          }
        },
        error: (err) => {
          console.error('Error de red o servidor', err);
        }
      });
    }else{
      this.publicService.getCoursesToProfessor(idUsuario).subscribe({
        next: (response) => {
          if (!response.error) {
            this.courses = response.respuesta;
          } else {
            console.error('Error en la respuesta del backend');
          }
        },
        error: (err) => {
          console.error('Error de red o servidor', err);
        }
      });
    }
  }
}
