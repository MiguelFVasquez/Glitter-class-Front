import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { DetalleExamenDto, PreguntaOpcionesExamenDto } from '../../model/exam/examDetailDto';
import { showAlert } from '../../model/alert';

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

  //-----To answer questions----
  idIntento:number=0;
  answers: { [preguntaId: number]: number } = {};       // almacena la opción seleccionada
  answered: { [preguntaId: number]: boolean } = {};    // flags de “ya contestada”

  // Para el modal
  showScoreModal = false;
  score: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examenService: ExamService
  ) {}


  //Load exam detail
  ngOnInit(): void {
    this.examenId = Number(this.route.snapshot.paramMap.get('idExamen')); /*All information to load an exam*/
    this.idUsuario = Number(this.route.snapshot.paramMap.get('idUsuario'));
    this.idIntento  = Number(this.route.snapshot.paramMap.get('idIntento'));


    console.log('Id del examen: ', this.examenId, 'Id del estudiante: ',this.idUsuario);
    if (this.examenId) {
      this.examenService.getDetailExam(this.examenId,this.idUsuario).subscribe({
        next: (resp) => {
          this.preguntas = resp.respuesta;
          console.log("respuesta del back: ", this.preguntas);
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

  submitAnswer(preguntaId: number) {
    const opcionId = this.answers[preguntaId];
    if (!opcionId) return;
    this.examenService
      .submitSingleAnswer(this.idIntento, preguntaId, opcionId)
      .subscribe({
        next: () => {
          this.answered[preguntaId] = true;
          // si ya todas contestadas, calculamos la nota
          const total = this.preguntas.length;
          const done = Object.keys(this.answered).length;
          if (done === total) {
            this.calcularNota();
          }
        },
        error: err => {
          console.error(err);
          showAlert('Error al enviar la respuesta', 'error');
        }
      });
  }

  calcularNota(){
    this.examenService.getCalificacion(this.idIntento).subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.score = resp.respuesta;
          this.showScoreModal = true;
        } else {
          showAlert(`Error al calcular nota: ${resp.mensaje}`, 'error');
        }
      },
      error: (err) => {
        console.error(err);
        showAlert('Error de comunicación al calcular nota', 'error');
      }
    });
  }
  closeScoreModal() {
    this.showScoreModal = false;
    // vuelve atrás
    this.router.navigate(['/student/groups']);
  }

}
