import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { CourseDto } from '../../model/courses/courseDto';

@Component({
  selector: 'app-cursos-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './cursos-card.component.html',
  styleUrl: './cursos-card.component.css'
})
export class CursosCardComponent {
  @Input() course!: CourseDto; // recibe todo el objeto
  @Input() isEnrolled: boolean = false;

  constructor(private router: Router) {}

  navigateToDetail(): void {
    this.router.navigate(['/student/courses', this.course.idCurso]);
  }
}
