import { Component,OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {userProfileDto } from '../../model/user/userProfileDTO';

@Component({
  selector: 'app-professor-profile',
  imports: [],
  templateUrl: './professor-profile.component.html',
  styleUrl: './professor-profile.component.css'
})
export class ProfessorProfileComponent implements OnInit {
  usuario?: userProfileDto;


  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const id = localStorage.getItem('userId');
    if (id) {
      this.usuarioService.getUsuarioById(+id).subscribe({
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
