import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule,Router } from '@angular/router';

@Component({
  selector: 'app-cursos-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './cursos-card.component.html',
  styleUrl: './cursos-card.component.css'
})
export class CursosCardComponent {
  @Input() courseId: string = ''; // Add course ID for navigation
  @Input() courseName: string = '';
  @Input() professorName: string = '';
  @Input() imageUrl: string = 'course-card.jpg'; // Default image path
  @Input() isEnrolled: boolean = false;

  constructor(private router: Router) {}

  navigateToDetail(): void {
    this.router.navigate(['/student/courses', this.courseId]);
  }
} 
