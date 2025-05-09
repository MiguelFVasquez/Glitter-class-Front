import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component,OnInit } from '@angular/core';
import {userProfileDto } from '../../model/user/userProfileDTO';
import { PublicService } from '../../services/public.service';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-profile',
  imports: [CommonModule,RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  usuario?: userProfileDto;
  constructor(private publicService:PublicService, private storageService: StorageService) {}

  ngOnInit(): void {
    const id = this.storageService.get('userId');
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
