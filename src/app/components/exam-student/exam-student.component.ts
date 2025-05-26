import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { DetalleExamenDto, PreguntaOpcionesExamenDto } from '../../model/exam/examDetailDto';

@Component({
  selector: 'app-exam-student',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './exam-student.component.html',
  styleUrl: './exam-student.component.css'
})

export class ExamStudentComponent implements OnInit {
  examenId: number = 0;
  idUsuario: number=0;
  examen: DetalleExamenDto | null = null;
  preguntas: PreguntaOpcionesExamenDto[]=[]
  loading = true;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private examenService: ExamService
  ) {}


  //Load exam detail
  ngOnInit(): void {
    this.examenId = Number(this.route.snapshot.paramMap.get('idExamen'));
    this.idUsuario = Number(this.route.snapshot.paramMap.get('idUsuario'));
    console.log('Id del examen: ', this.examenId, 'Id del estudiante: ',this.idUsuario);
    if (this.examenId) {
      this.examenService.getDetailExam(this.examenId,this.idUsuario).subscribe({
        next: (resp) => {
          this.preguntas = resp.respuesta;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el examen.';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

}
