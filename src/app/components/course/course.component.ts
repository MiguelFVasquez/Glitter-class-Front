import { Component } from '@angular/core';
import { CursosCardComponent } from '../cursos-card/cursos-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CursosCardComponent, CommonModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent {
  courses = [
    {
      id: '1',
      name: 'Data Bases',
      professor: 'Jorge Ivan Triviño',
      image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      isEnrolled: true
    },
    {
      id:'2',
      name: 'Artificial Inteligence',
      professor: 'Carlos Eduardo',
      image: 'course-card.jpg',
      isEnrolled: true
    },
    {
      id:'3',
      name: 'Web developer',
      professor: 'Carlos Rojo',
      image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      isEnrolled: true
    },
    {
      id: '4',
      name: 'Computational Infraestructure',
      professor: 'Luis Eduardo',
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      isEnrolled: true
    },
    { 
      'id':'5',
      name: 'Operative Systems',
      professor: 'Sebastian Rodriguez',
      image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      isEnrolled: true
    },
    {
      'id':'6',
      name: 'Security',
      professor: 'Sonia',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      isEnrolled: true
    }
  ];
}