import { Component,OnInit } from '@angular/core';
import {userProfileDto } from '../../model/user/userProfileDTO';
import { PublicService } from '../../services/public.service';
import { StorageService } from '../../services/storage.service';
import { CourseDto } from '../../model/courses/courseDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-professor-profile',
  imports: [CommonModule],
  templateUrl: './professor-profile.component.html',
  styleUrl: './professor-profile.component.css'
})
export class ProfessorProfileComponent implements OnInit {
  usuario?: userProfileDto;
  courses: CourseDto[]= [];

  constructor(private publicService:PublicService, private storageService: StorageService) {}

  ngOnInit(): void {
    const id = this.storageService.get('userId');
    const idUsuario: number = Number(id);
    if (id) {
      this.publicService.getUsuarioById(+id).subscribe({
        next: (resp) => {
          this.usuario = resp.respuesta;
          this.storageService.setUserUnit(resp.respuesta.idUnidad);
        },
        error: (err) => {
          console.error('Error al obtener usuario', err);
        }
      });
    }
    //Load the courses of the professor
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
