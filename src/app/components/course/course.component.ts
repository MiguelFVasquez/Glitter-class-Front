import { Component, OnInit } from '@angular/core';
import { CursosCardComponent } from '../cursos-card/cursos-card.component';
import { CommonModule } from '@angular/common';
import { PublicService } from '../../services/public.service';
import { StorageService } from '../../services/storage.service';
import { CourseDto } from '../../model/courses/courseDto';
import { showAlert } from '../../model/alert';

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
    const idUsuario: number = Number(this.storageService.get('userId'));
    const idRol: number = Number(this.storageService.getUserRole());
    if (idRol==3) { //If currently rol is student we get all courses from this student
      this.publicService.getCoursesToStudent(idUsuario).subscribe({
        next: (response) => {
          if (!response.error) {
            this.courses = response.respuesta;
            console.log("Respuesta del back" , response.respuesta)
          } else {
            console.error('Error en la respuesta del backend');
            showAlert('Error al obtener los cursos del estudiante '+ response.mensaje, 'error')
          }
        },
        error: (err) => {
          console.error('Error de red o servidor ', err);
          showAlert('Error de servidor '+ err, 'error')
        }
      });
    }else{  //If the rol is professor, then load professor courses
      this.publicService.getCoursesToProfessor(idUsuario).subscribe({
        next: (response) => {
          if (!response.error) {
            this.courses = response.respuesta;
          } else {
            console.error('Error en la respuesta del backend');
            showAlert('Error al obtener los cursos del profesor '+ response.mensaje, 'error')
          }
        },
        error: (err) => {
          console.error('Error de red o servidor', err);
          showAlert('Error al obtener los cursos del profesor '+ err, 'error')
        }
      });
    }
  }
}
