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
  // Listas para selects
  grupos: { idGrupo: number; nombre: string }[] = [];
  temas: { idTema: number; nombre: string }[] = [];
  unidades: { idUnidad: number; nombre: string }[] = [];
  preguntasDisponibles: { idPregunta: number; enunciado: string }[] = [];

  // DTO para crear examen
  newExam: createExam = {
    idGrupo: 0,
    idDocente: 0,
    idTema: 0,
    titulo: '',
    descripcion: '',
    preguntasMostradas: 1,
    tiempoLimite: 1,
    fechaDisponible: new Date().toISOString().slice(0,16),
    fechaCierre: new Date().toISOString().slice(0,16),
    pesoEnCurso: 0,
    umbralAprobacion: 0,
    aleatorizarPreguntas: 0,
    mostrarResultados: 0,
    idUnidad: 0,
    idEstado: 1,            // hardcodeado
    listaPreguntas: []
  };
  //User information
  idUsuario: number=0;
  idUnidad: number=0;

  constructor(
    private publicService: PublicService,
    private storageService: StorageService,
    private examService: ExamService
  ){}
  
  ngOnInit(): void {
    //Load user information
    const idUsuario= this.storageService.get('userId');
    this.idUsuario= Number(idUsuario);
    this.idUnidad = Number(this.storageService.getUserUnidad());

    //Load exams
    this.loadExams(this.idUsuario);
    //Load units
    this.loadUnits(this.idUsuario);
    //Load themes
    this.loadThemes(this.idUnidad);

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
          showAlert('Erro al obtener las unidades '+ resp.mensaje, 'error')
        }
      },   
      error: () => console.warn('Error cargando las unidades')
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

    // Obtener el enunciado de una pregunta por su ID
  getPreguntaEnunciado(idPregunta: number): string {
    const pregunta = this.preguntasDisponibles.find(p => p.idPregunta === idPregunta);
    return pregunta ? pregunta.enunciado : 'Pregunta eliminada';
  }

  // Calcular porcentaje total
  getTotalPorcentaje(): number {
    return this.newExam.listaPreguntas.reduce((sum, q) => sum + q.porcentaje, 0);
  }


  // Añade una pregunta al examen
  addQuestionToExam(idPregunta: number, porcentaje: number) {
    if (!this.newExam.listaPreguntas.find(q => q.idPregunta === idPregunta)) {
      this.newExam.listaPreguntas.push({ 
        idPregunta, 
        porcentaje 
      });
    }
  }

  // Quita una pregunta de la lista
  removeQuestionFromExam(index: number) {
    this.newExam.listaPreguntas.splice(index, 1);
  }

  // Envía el examen al backend
  submitExam() {
    this.examService.createExam(this.newExam).subscribe({
      next: (resp: Message<number>) => {
        if (!resp.error) {
          showAlert('Examen creado con ID ' + resp.respuesta, 'success');
          this.showCreateForm = false;
          this.loadExams(this.idUsuario);
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


}
