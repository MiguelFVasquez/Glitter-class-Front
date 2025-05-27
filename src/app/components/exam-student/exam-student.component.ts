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
  //-------Kind of questions-----------
  answers: { [idPregunta: number]: number } = {}; // para radio
  multiAnswers: { [idPregunta: number]: number[] } = {}; // para checkbox
  completeAnswers: { [idPregunta: number]: string[] } = {}; // para completar
  matchAnswers: { [idPregunta: number]: string[] } = {}; // para emparejar
  answered: { [idPregunta: number]: boolean } = {};
  // Para el modal
  showScoreModal = false;
  score: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examenService: ExamService
  ) {}


  respuestasUsuario: { [idPregunta: number]: string[] } = {};
  

  //Load exam detail
  ngOnInit(): void {
    this.examenId = Number(this.route.snapshot.paramMap.get('idExamen'));
    this.idUsuario = Number(this.route.snapshot.paramMap.get('idUsuario'));
    this.idIntento  = Number(this.route.snapshot.paramMap.get('idIntento'));

    if (this.examenId) {
      this.examenService.getDetailExam(this.examenId, this.idUsuario).subscribe({
        next: (resp) => {
          this.preguntas = resp.respuesta;
          this.loading = false;

          // Inicializar estructuras de respuestas según tipo de pregunta
          this.preguntas.forEach(pregunta => {
            if (pregunta.idTipo === 6) {
              this.completeAnswers[pregunta.idPregunta] = Array(pregunta.opciones.length).fill('');
            } else if (pregunta.idTipo === 5) {
              this.matchAnswers[pregunta.idPregunta] = Array(pregunta.opciones.length).fill('');
            } else if (pregunta.idTipo === 2) {
              this.multiAnswers[pregunta.idPregunta] = [];
            }
          });
        },
        error: (err) => {
          this.error = 'Error al cargar el examen.';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  //--------------VALIDATIONS---------------------------

  isSingleChoice(p: PreguntaOpcionesExamenDto) {
    return p.idTipo === 1 || p.idTipo === 3 || p.idTipo === 6;
  }

  isMultipleChoice(p: PreguntaOpcionesExamenDto) {
    return p.idTipo === 2;
  }

  isMatching(p: PreguntaOpcionesExamenDto) {
    return p.idTipo === 5;
  }

  isOrdering(p: PreguntaOpcionesExamenDto) {
    return p.idTipo === 4;
  }
  // Función para mezclar las descripciones y evitar orden predecible
  getDescripcionesMezcladas(opciones: any[]): string[] {
    const descripciones = opciones.map(op => op.textoPareja);
    return this.shuffleArray([...descripciones]);
  }

  // Función auxiliar para mezclar un array (Fisher-Yates)
  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }



toggleMultiAnswer(idPregunta: number, opcionId: number) {
  if (!this.multiAnswers[idPregunta]) this.multiAnswers[idPregunta] = [];
  const index = this.multiAnswers[idPregunta].indexOf(opcionId);
  if (index === -1) {
    this.multiAnswers[idPregunta].push(opcionId);
  } else {
    this.multiAnswers[idPregunta].splice(index, 1);
  }
}

isChecked(idPregunta: number, opcionId: number): boolean {
  return this.multiAnswers[idPregunta]?.includes(opcionId);
}

isSubmitDisabled(pregunta: PreguntaOpcionesExamenDto): boolean {
  switch (pregunta.idTipo) {
    case 1:
    case 2:
      return !this.answers[pregunta.idPregunta];
    case 3:
      return !this.multiAnswers[pregunta.idPregunta]?.length;
    case 5:
      // Cambiar completeAnswers por matchAnswers
      return this.matchAnswers[pregunta.idPregunta]?.some(t => !t);
    case 6:
      return this.completeAnswers[pregunta.idPregunta]?.some(t => !t);
    default:
      return false;
  }
}
submitAnswer(preguntaId: number) {
  const pregunta = this.preguntas.find(p => p.idPregunta === preguntaId);
  if (!pregunta) return;

  let payload;

  switch (pregunta.idTipo) {
    case 1: // Selección única
    case 3: // Falso/Verdadero (también es selección única)
    case 4: // Ordenar (también parece ser única opción)
    case 6: // Completar (con opciones)
      payload = { opcionId: this.answers[preguntaId] };
      break;

    case 2: // Selección múltiple
      payload = { opcionesIds: this.multiAnswers[preguntaId] };
      break;

    case 5: // Emparejar
      payload = { respuestas: this.matchAnswers[preguntaId] };
      break;

    default:
      return;
  }


  this.examenService.submitSingleAnswer(this.idIntento, preguntaId, Number(payload.opcionId))
    .subscribe({
      next: () => {
        this.answered[preguntaId] = true;
        const done = Object.keys(this.answered).length;
        if (done === this.preguntas.length) this.calcularNota();
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
