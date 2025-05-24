import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseDto } from '../../model/courses/courseDto';
import { CourseService } from '../../services/course.service';
import { Message } from '../../model/message/messageDTO';
import { showAlert } from '../../model/alert';
@Component({
  selector: 'app-detail-course',
  imports: [CommonModule],
  templateUrl: './detail-course.component.html',
  styleUrl: './detail-course.component.css'
})
export class DetailCourseComponent {
  
  constructor(private route: ActivatedRoute,private courseService: CourseService) {}

  courseId!: number;
  courseDetails?: CourseDto;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseId = +idParam;
      this.loadCourseDetails();
    }
  }


  loadCourseDetails(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (resp: Message<CourseDto>) => {
        if (!resp.error) {
          this.courseDetails = resp.respuesta;
        } else {
          console.error('Error al obtener curso:', resp.mensaje);
          showAlert('Erro a la hora de obtener los cursos ' +resp.mensaje, 'error' );
        }
      },
      error: err => {
        console.error('Error de red al obtener curso:', err);
        showAlert('Error de servidor al obtener el curso: ' + err, 'error');
      }
    });
  }
}
