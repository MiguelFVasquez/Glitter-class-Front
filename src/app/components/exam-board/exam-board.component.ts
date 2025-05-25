import { Component, OnInit } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { readExam } from '../../model/exam/readExamDto';
import { PublicService } from '../../services/public.service';
import { ExamService } from '../../services/exam.service';
import { StorageService } from '../../services/storage.service';
import { unidadAcademica } from '../../model/enums/unidadDto';
import { categoria } from '../../model/enums/categoriaDto';
import { createExam } from '../../model/exam/createExamDto';
import { preguntaExamenDto } from '../../model/exam/createExamDto';
import { Message } from '../../model/message/messageDTO';
import { showAlert } from '../../model/alert';
import { grupoDocente } from '../../model/grupos/grupoDto';
import { readPublicQuestion } from '../../model/questions/readQuestionDto';
import { QuestionService } from '../../services/question.service';
import { createdExam } from '../../model/exam/createdExamDto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-exam-board',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './exam-board.component.html',
  styleUrl: './exam-board.component.css'
})
export class ExamBoardComponent implements OnInit {
  
  //Exams
  exams: readExam[] = [];
  showCreateForm = false;
  
  //Exam information
  units: unidadAcademica[]=[];
  themes: categoria[] = [];
  groups: grupoDocente[]=[]
  //After create
  idTheme: createdExam ={
    idExamen:0,
    idTemas:0
  }
  // Listas para selects
  grupos: { idGrupo: number; nombre: string }[] = [];
  temas: { idTema: number; nombre: string }[] = [];
  unidades: { idUnidad: number; nombre: string }[] = [];

  //Modal to add question to exam
  showQuestionForm = false;    // para el segundo modal (asignar preguntas)
  createdExamId: number = 0;
  createExamThemId: number | null=null;
  createdExamTitle = '';
  listaPreguntas: preguntaExamenDto[]=[];
  preguntasDisponibles: readPublicQuestion[] = [];
  
  tab: 'publicas' | 'propias' = 'publicas';
  // DTO para crear examen
  newExam: createExam = {
    idGrupo: 0,
    idDocente: 0,
    idTema: 0,
    titulo: '',
    descripcion: '',
    tiempoLimite: 1,
    fechaDisponible: new Date().toISOString().slice(0,16),
    fechaCierre: new Date().toISOString().slice(0,16),
    pesoEnCurso: 0,
    umbralAprobacion: 0,
    idUnidad: 0
  };
  //User information
  idUsuario: number=0;
  idUnidad: number=0;
  

  constructor(
    private publicService: PublicService,
    private storageService: StorageService,
    private examService: ExamService,
    private questionService: QuestionService)
    {
    this.newExam.idDocente= Number(this.storageService.get('userId'));
  }
  
  ngOnInit(): void {
    //Load user information
    const idUsuario= this.storageService.get('userId');
    this.idUsuario= Number(idUsuario);
    this.idUnidad = Number(this.storageService.getUserUnidad());
    this.newExam.idDocente= this.idUsuario
    //Load exams
    this.loadExams(this.idUsuario);
    //Load units
    this.loadUnits(this.idUsuario);
    //Load themes
    this.loadThemes(this.idUnidad);
    //Load groups
    this.loadGroups(this.idUsuario);

  }
  
  //Method to get all professor exams
  loadExams(id:number){
    this.examService.getExams(id).subscribe({
      next: resp =>{
        if(!resp.error){
          this.exams=resp.respuesta;
        }else{
          showAlert('Error al obtener los examenes'+ resp.mensaje, 'error')
          console.warn('Error en getExam')
        }
      },
      error:err => {
        console.log('Error al cargar los examenes', err)
        showAlert('Error al obtener los examenes'+ err.mensaje, 'error')
      
      }
    })
  }
  //Method to get all units according to the professor unit
  loadUnits(id:number){
    this.publicService.getProfessorUnities(id).subscribe({
      next: resp=>{
        if(!resp.error){
          this.units= resp.respuesta;
        }else{
          console.warn('Error en getUnidades')
          showAlert('Error al obtener las unidades '+ resp.mensaje, 'error')
        }
      },   
      error: () => console.warn('Error cargando las unidades')
    })
  }

  //Method to get all professor groups
  loadGroups(id:number){
    this.publicService.getGruposProfessor(id).subscribe({
      next: resp =>{
        if(!resp.error){
          this.groups=resp.respuesta;
        }else{
          console.warn('Error en getGroups')
          showAlert('Error al obtener los grupos '+ resp.mensaje, 'error')
        }
      },
      error:(err) =>{
        showAlert('Error al obtener los grupos del profesor '+ err.mensaje, 'error')
      }
    })
  }

  //Method to get all themes according to the id unit
  loadThemes(idUnit:number){
     this.publicService.getTemasUnidad(idUnit).subscribe({
      next: resp => {
        if (!resp.error) {
          this.themes = resp.respuesta;
        }else{
          console.warn ('Error en getCategorias')
          showAlert('Erro al obtener los temas ' + resp.mensaje , 'error')
        }
      },
      error: () => console.error('Error cargando los temas')
    });
  }

  
  //----------------Create exam-------------------------------\\

  // Envía el examen al backend
  submitExam() {
    console.log("Examen enviado al back: " , this.newExam);
    this.examService.createExam(this.newExam).subscribe({
      next: (resp: Message<createdExam>) => {
        if (!resp.error) {
          this.createdExamId   = resp.respuesta.idExamen;
          this.createExamThemId = this.newExam.idTema;
          this.createdExamTitle = this.newExam.titulo;
          showAlert(`Examen creado (#${this.createdExamTitle}). Ahora asocia preguntas.`, 'success');
          this.loadQuestions();  
          this.showQuestionForm = true; // abre el segundo modal
      
        } else {
          showAlert('Error creando examen: ' + resp.mensaje, 'error');
        }
      },
      error: err => {
        console.error(err);
        showAlert('Error de comunicación ' + err , 'error');
      }
    });
  }


//-----------------ADD questions to exam-------------
  // Catálogo de preguntas: públicas y propias
  preguntasPublicas: readPublicQuestion[] = [];
  preguntasPropias:  readPublicQuestion[] = [];


  submitQuestions() {
    if (this.getTotalPorcentaje() !== 100) {
      showAlert('El porcentaje total debe ser 100%', 'error');
      return;
    }

    // Generamos un array de Observables, uno por cada pregunta
    const calls = this.listaPreguntas.map(q =>
      this.examService.addQuestion(this.createdExamId, q.idPregunta)
    );

    // forkJoin espera a que todas terminen
    forkJoin(calls).subscribe({
      next: results => {
        showAlert('Todas las preguntas fueron agregadas exitosamente', 'success');
        this.showQuestionForm = false;
        this.listaPreguntas = [];
        // refresca tu vista si es necesario
      },
      error: err => {
        console.error('Error asociando preguntas:', err);
        showAlert('Ocurrió un error al asociar preguntas', 'error');
      }
    });

  }


  loadQuestions() {
    forkJoin({
      pub: this.questionService.getQuestionByTheme(this.newExam.idTema),
      own: this.questionService.getQuestions(this.newExam.idDocente)
    }).subscribe(({pub, own}) => {
      this.preguntasPublicas = pub.error ? [] : pub.respuesta;
      this.preguntasPropias = own.error ? [] : own.respuesta;
      this.preguntasDisponibles = [...this.preguntasPublicas, ...this.preguntasPropias];
    });
  }

  isAdded(idPregunta: number): boolean {
    return this.listaPreguntas.some(q => q.idPregunta === idPregunta);
  }

  // Obtener el enunciado de una pregunta por su ID
  getPreguntaEnunciado(idPregunta: number): string {
    // Busca primero en públicas
    let pregunta = this.preguntasPublicas.find(p => p.idPregunta === idPregunta);
    // Si no la encuentra, busca en propias
    if (!pregunta) {
      pregunta = this.preguntasPropias.find(p => p.idPregunta === idPregunta);
      if (!pregunta) {
        console.warn(`Pregunta no encontrada: ID ${idPregunta}`);
        console.warn('Preguntas públicas:', this.preguntasPublicas);
        console.warn('Preguntas propias:', this.preguntasPropias);
      }
    }
    
    return pregunta ? pregunta.enunciado : 'Pregunta eliminada 😭';
  }

// Elimina getPreguntaEnunciadoPriv ya que no es necesaria

  // Calcular porcentaje total

  getTotalPorcentaje(): number {
    return this.listaPreguntas.reduce((sum, q) => sum + q.porcentaje, 0);
  }

  addQuestionToExam(idPregunta: number) {
    if (!this.createdExamId) {
      showAlert('Primero guarda el examen para obtener su ID', 'error');
      return;
    }
    if (!this.isAdded(idPregunta)) {
      this.listaPreguntas.push({
        idPregunta,
        porcentaje: 0,
        idExamen: this.createdExamId
      });
    }
  }


  // Quita una pregunta de la lista
  removeQuestionFromExam(index: number) {
    this.listaPreguntas.splice(index, 1);
  }
}
