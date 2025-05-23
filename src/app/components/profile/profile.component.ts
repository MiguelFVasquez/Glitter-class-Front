import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component,OnInit } from '@angular/core';
import {userProfileDto } from '../../model/user/userProfileDTO';
import { PublicService } from '../../services/public.service';
import { StorageService } from '../../services/storage.service';
import { CourseDto } from '../../model/courses/courseDto';
import { showAlert } from '../../model/alert';


@Component({
  selector: 'app-profile',
  imports: [CommonModule,RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  usuario?: userProfileDto;
  courses: CourseDto[]= [];

  constructor(private publicService:PublicService, private storageService: StorageService) {}

  ngOnInit(): void {
    const id = this.storageService.get('userId');
    const idUsuario: number = Number(id);
    if (id) {
      this.publicService.getUsuarioById(+id).subscribe({
        next: (resp) => {
          if(!resp.error){
            this.usuario = resp.respuesta; 
          }else{
            showAlert('Error al obtener los datos del usuario'+ resp.mensaje, 'error')
          }
        },
        error: (err) => {
          console.error('Error al obtener usuario', err);
          showAlert('Error del servidor al obtener los datos del usuario'+ err, 'error')
        }
      });
    }
    //Load the courses of the student
    this.publicService.getCoursesToStudent(idUsuario).subscribe({
      next: (response) => {
        if (!response.error) {
          this.courses = response.respuesta;
        } else {
          console.error('Error en la respuesta del backend');
          showAlert('Error al obtener los cursos del estudiante '+ response.mensaje, 'error')
        }
      },
      error: (err) => {
        console.error('Error de red o servidor', err);
        showAlert('Error del servidor al obtener los cursos del usuario '+ err.mensaje, 'error')
      }
    });


  }
}
