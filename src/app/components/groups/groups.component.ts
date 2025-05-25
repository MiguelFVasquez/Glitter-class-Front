import { Component, OnInit } from '@angular/core';
import {userProfileDto } from '../../model/user/userProfileDTO';
import { Router, RouterModule } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { StorageService } from '../../services/storage.service';
import { showAlert } from '../../model/alert';
import { grupoDocente } from '../../model/grupos/grupoDto';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../services/exam.service';
@Component({
  selector: 'app-groups',
  imports: [CommonModule,RouterModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent implements OnInit {
  
  usuario?: userProfileDto;
  groups: grupoDocente[]= [];

  constructor(
    private publicService: PublicService, 
    private storageService: StorageService,
    private examService: ExamService,
    private router: Router,){}

  ngOnInit(): void {
    const id = this.storageService.get('userId');
    const idUsuario: number = Number(id);
    this.loadGroups(idUsuario);
  }

  loadGroups(idUsuario:number){
    this.publicService.getGruposStudent(idUsuario).subscribe({
      next: (response) => {
        if (!response.error) {
          this.groups = response.respuesta;
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

  openGroupDetails(group: grupoDocente) {
  console.log('Grupo seleccionado:', group.idGrupo);
  console.log('id usuario: ', this.usuario?.idUsuario )
  this.router.navigate(['/student/groups', group.idGrupo]);
  }
}
