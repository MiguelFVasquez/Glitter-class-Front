import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-detail-course',
  imports: [CommonModule],
  templateUrl: './detail-course.component.html',
  styleUrl: './detail-course.component.css'
})
export class DetailCourseComponent {
  constructor(private route: ActivatedRoute) {}
  courseId: string = '';
  courseDetails: any;

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCourseDetails();
  }


  loadCourseDetails(): void {
    // In a real app, you would fetch this from a service
    // This is just mock data for demonstration
    const mockCourses = [
      {
        id: '1',
        name: 'Bases de Datos',
        professor: 'Dr. Rodríguez',
        image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        description: 'Curso avanzado sobre diseño e implementación de bases de datos relacionales y no relacionales.',
        schedule: 'Lunes y Miércoles 10:00-12:00',
        credits: 8,
        isEnrolled: true
      }
      // ... other mock courses
    ];
    
    this.courseDetails = mockCourses.find(c => c.id === this.courseId);
  }

}
