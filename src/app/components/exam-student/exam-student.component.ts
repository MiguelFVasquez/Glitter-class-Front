import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { DetalleExamenDto } from '../../model/exam/examDetailDto';

@Component({
  selector: 'app-exam-student',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './exam-student.component.html',
  styleUrl: './exam-student.component.css'
})

export class ExamStudentComponent implements OnInit {
  examenId: number = 0;
  examen: DetalleExamenDto | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private examenService: ExamService
  ) {}


  //Load exam detail
  ngOnInit(): void {
    this.examenId = Number(this.route.snapshot.paramMap.get('id'));
    const idEstudiante = Number(this.route.snapshot.paramMap.get('idEstudiante'));
    if (this.examenId) {
      this.examenService.getDetailExam(this.examenId,idEstudiante).subscribe({
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
    }
  }

}
