import { Component,OnInit } from '@angular/core';
import {userProfileDto } from '../../model/user/userProfileDTO';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-professor-profile',
  imports: [],
  templateUrl: './professor-profile.component.html',
  styleUrl: './professor-profile.component.css'
})
export class ProfessorProfileComponent implements OnInit {
  usuario?: userProfileDto;


  constructor(private publicService:PublicService) {}

  ngOnInit(): void {
    const id = localStorage.getItem('userId');
    if (id) {
      this.publicService.getUsuarioById(+id).subscribe({
        next: (resp) => {
          this.usuario = resp.respuesta;
        },
        error: (err) => {
          console.error('Error al obtener usuario', err);
        }
      });
    }
  }


}
