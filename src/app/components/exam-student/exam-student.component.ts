import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { DetalleExamenDto } from '../../model/exam/examDetailDto';
import { StorageService } from '../../services/storage.service';
import { userProfileDto } from '../../model/user/userProfileDTO';

@Component({
  selector: 'app-exam-student',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './exam-student.component.html',
  styleUrl: './exam-student.component.css'
})

export class ExamStudentComponent implements OnInit {
  examenId: number = 0;
  usuario?: userProfileDto;
  examen: DetalleExamenDto | null = null;
  loading = true;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private examenService: ExamService,
    private storageService: StorageService,
    
  ) {}


  //Load exam detail
 ngOnInit(): void {
  const id = this.storageService.get('userId');
  const idUsuario: number = Number(id); //LOad user id

  this.route.params.subscribe(params => {
    this.examenId = Number(params['idExamen']);

    if (this.examenId && idUsuario) {
      this.examenService.getDetailExam(this.examenId, idUsuario).subscribe({
        next: (resp) => {
          this.examen = resp.respuesta;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el examen.';
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.error = 'Parámetros inválidos.';
      this.loading = false;
    }
  });
}


}
