import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule,ReactiveFormsModule,FormArray } from '@angular/forms';
import { PublicService } from '../../services/public.service';
import { categoria } from '../../model/enums/categoriaDto';
import {tipoPregunta} from '../../model/enums/tiposPreguntaDto';
import {dificultad} from '../../model/enums/dificultadesDto';
import {visibility} from '../../model/enums/visibilidadDto';
import { readPublicQuestion } from '../../model/questions/readQuestionDto';
import { StorageService } from '../../services/storage.service';
import { QuestionService } from '../../services/question.service';
import { createQuestion } from '../../model/questions/createQuestionDto';
import { unidadAcademica } from '../../model/enums/unidadDto';
import { createOption } from '../../model/questions/createOptionDto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-question-board',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './question-board.component.html',
  styleUrl: './question-board.component.css'
})

export class QuestionBoardComponent implements OnInit {
  //Flags de UI
  questionForm!: FormGroup;
  showOptionForm = false;
  //Information about question
  themes: categoria[] = [];
  difficultyLevels: dificultad[] = []
  questionTypes: tipoPregunta[] = [];
  visibiliy: visibility[]=[];
  units: unidadAcademica[]=[];
  //questions
  questions: readPublicQuestion[] = []; //All public questions
  professorQuestion: readPublicQuestion[]=[] //All professor questions publics and privates
  selectedQuestionType = '';
  filterType = '';
  //id usuario
  idUsuario:number=0;
  idUnidad:number=0;
  //variable to create questions
  showQuestionForm = false;
  newQuestion: createQuestion = {
  enunciado: '',
  idTema: 0,
  idDificultad: 0,
  idTipo: 0,
  porcentajeNota: 0,
  idVisibilidad: 0,
  idDocente:0,
  idUnidad: 0,
  idEstado: 1
};

createdQuestionId: number =0; //Id de la pregunta creada

// Opciones que el usuario va agregando
opcionesToCreate: createOption[] = [];



  constructor(
    private fb: FormBuilder,
    private publicService:PublicService,
    private storageService: StorageService,
    private questionService: QuestionService) {
    this.initializeForm();
    this.newQuestion.idDocente=Number(this.storageService.get('userId'));
  }

  initializeForm(): void {
   this.questionForm = this.fb.group({
    enunciado:     ['', Validators.required],
    tipo:          [0, Validators.required],
    tema:          [0, Validators.required],
    unidadId:      [0, Validators.required],   // <-- unidad académica
    dificultad:    [0, Validators.required],
    tiempoMaximo:  [60,  [Validators.required, Validators.min(10)]],
    porcentaje:    [10,  [Validators.required, Validators.min(1), Validators.max(100)]],
    visibilidadId: [0, Validators.required],
    estadoId:      [1]
  });

    this.questionForm.get('tipo')?.valueChanges.subscribe(type => {
      this.selectedQuestionType = type;
      this.updateFormForQuestionType();
    });
  }

  ngOnInit(): void { 
    const id = this.storageService.get('userId');
    this.idUsuario = Number(id);
    this.newQuestion.idDocente=Number(this.storageService.get('userId'));
    this.idUnidad = Number(this.storageService.getUserUnidad());
    //Cargar categorías
    this.loadThemes();
    //Cargar tipos de pregunta
    this.loadQuestionTypes();
    // Cargar niveles de dificultad
    this.loadDificulties();
    // cargar visibilidad
    this.loadVisibility();
    //Cargar preguntas publicas
    this.loadPublicQuestions();
    //Cargar las unidaddes del profesor
    this.loadUnits(this.idUsuario);
    //cargar las preguntas del profesor
    this.loadProfessorQuestions(this.idUsuario);
  }

  resetAll() {
    this.showOptionForm = false;
    this.createdQuestionId = 0 as any;
    this.opcionesToCreate = [];
    // reinicia newQuestion…
  }
  //-------------ENUMS-------------------
  //Method to get all units
  loadUnits(id:number){
    this.publicService.getProfessorUnities(id).subscribe({
      next: resp=>{
        if(!resp.error){
          this.units= resp.respuesta;
        }else{
          console.warn('Error en getUnidades')
          alert('Erro al obtener las unidades '+ resp.mensaje)
        }
      },   
      error: () => console.warn('Error cargando las unidades')
    })
  }

  //Method to get all themes
  loadThemes(){
    this.publicService.getTemasUnidad(this.idUnidad).subscribe({
      next: resp => {
        if (!resp.error) {
          this.themes = resp.respuesta;
        }else{
          console.warn ('Error en getCategorias')
          alert('Erro al obtener los temas '+ resp.mensaje)
        }
      },
      error: () => console.error('Error cargando los temas')
    });
  }
  //Method to get all types of questions
  loadQuestionTypes(){
      this.publicService.getTiposPregunta().subscribe({
      next: resp => {
        if (!resp.error) {
          this.questionTypes = resp.respuesta;
        } else {
          console.warn('Error en getTiposPregunta');
          alert('Erro al obtener los temas '+ resp.mensaje)
        }
      },
      error: err => console.error('Error al cargar tipos de pregunta', err)
    });
  }
  //Method to load all dificulties
  loadDificulties(){
      this.publicService.getDificultades().subscribe({
      next: resp => {
        if (!resp.error) {
          this.difficultyLevels = resp.respuesta;
        } else {
          console.warn('Error en getDificultades');
          alert('Erro al obtener las dificultades '+ resp.mensaje)
        }
      },
      error: err => console.error('Error al cargar dificultades', err)
    });
  }
  //Method to load all the visibities
  loadVisibility(){
    this.publicService.getVisibility().subscribe({
      next: resp =>{
        if(!resp.error){
          this.visibiliy=resp.respuesta;
        }else{
          console.warn('Error en get visibilidades')
          alert('Erro al obtener las visibilidades '+ resp.mensaje)
        }
      },
      error :err => console.error('Error al cargar las dificultades', err)
    })
  }

  //-----------QUESIONS---------------

  //Method to load all public questions
  loadPublicQuestions(){
    this.publicService.getPublicQuestions().subscribe({
      next: resp => {
        if(!resp.error){
          this.questions=resp.respuesta;
        }else{
          console.warn('Error en getPublicQuestions')
          alert('Erro al obtener las preguntas publicas '+ resp.mensaje)
        }
      },
      error:err => console.log('Error al cargar las preguntas públicas', err)
    })
  }
  //Method to get all professor questions
  loadProfessorQuestions(id:number){
    this.questionService.getQuestions(id).subscribe({
      next: resp => {
        if(!resp.error){
          this.professorQuestion=resp.respuesta;
        }else{
          console.warn('Error en get professor question')
          alert('Erro al obtener las preguntas del profesor '+ resp.mensaje)
        }
      },
      error:err => console.log('Error al cargar las preguntas públicas', err)
    })
  }


  get opciones(): FormArray {
    return this.questionForm.get('opciones') as FormArray;
  }

  get pares(): FormArray {
    return this.questionForm.get('pares') as FormArray;
  }

  get elementosOrdenar(): FormArray {
    return this.questionForm.get('elementosOrdenar') as FormArray;
  }
  updateFormForQuestionType(): void {
    // Here you would add/remove form controls based on question type
    // For example, add options field for multiple choice questions
     // Clear all dynamic form arrays
    this.opciones.clear();
    this.pares.clear();
    this.elementosOrdenar.clear();

    switch(this.selectedQuestionType) {
      case 'Selección múltiple única respuesta':
        this.addOption();
        this.addOption();
        break;
      case 'Selección múltiple múltiples respuestas':
        this.addOption();
        this.addOption();
        this.addOption();
        break;
      case 'Falso y verdadero':
        this.addOption('Verdadero');
        this.addOption('Falso');
        break;
      case 'Ordenar':
        this.addOrderElement();
        this.addOrderElement();
        break;
      case 'Emparejar':
        this.addPair();
        this.addPair();
        break;
      case 'Completar':
        // No specific options needed for completion questions
        break;
    }
  }

  toggleQuestionForm(): void {
    this.showQuestionForm = !this.showQuestionForm;
    
    if (!this.showQuestionForm) {
      this.questionForm.reset();
      this.selectedQuestionType = '';

    }
  }

    addOption(texto: string = ''): void {
    const optionGroup = this.fb.group({
      texto: [texto, Validators.required],
      correcta: [false]
    });
    this.opciones.push(optionGroup);
  }

  addPair(): void {
    const pairGroup = this.fb.group({
      izquierda: ['', Validators.required],
      derecha: ['', Validators.required]
    });
    this.pares.push(pairGroup);
  }

  addOrderElement(): void {
    const elementGroup = this.fb.group({
      texto: ['', Validators.required],
      orden: [0]
    });
    this.elementosOrdenar.push(elementGroup);
  }

  removeOption(index: number): void {
    this.opciones.removeAt(index);
  }

  removePair(index: number): void {
    this.pares.removeAt(index);
  }

  removeOrderElement(index: number): void {
    this.elementosOrdenar.removeAt(index);
  }

submitQuestion() {
  
  console.log('pregunta a enviar: ', this.newQuestion)
  this.questionService.createQuestion(this.newQuestion).subscribe({
    next: (response) => {
      this.createdQuestionId = response.respuesta; //Respuesta del back con el id de la pregunta creada
      alert('Pregunta creada exitosamente. Ahora agrega las opciones.');
        // una vez creada, se bloquea repetir envío…
        this.showQuestionForm = false;
        // se abre el formulario de opciones
        this.showOptionForm = true;
    },
    error: (err) => {
      console.error(err);
      alert('Error al crear la pregunta' + err.mensaje);
    }
  });
}


  addOptionRow() {
    this.opcionesToCreate.push({
      textoOpcion: '',
      idTipoRespuesta: 2 // por defecto “incorrecta”
    });
  }

  submitOptions() {
    // Enviar cada opción vinculada al id de pregunta
    console.log("Opciones a enviar", this.opcionesToCreate);
    const calls = this.opcionesToCreate.map(opt =>
      this.questionService
        .createOption(this.createdQuestionId, opt)
    );
    forkJoin(calls).subscribe({
      next: () => {
        alert('Opciones guardadas correctamente');
        this.resetAll();
      },
      error: err => {
        console.error(err);
        alert('Error al guardar opciones' + err.mensaje);
      }
    });
  }

  get filteredQuestions() {
    if (!this.filterType) return this.questions;
    return this.questions.filter(q => q.tipo === this.filterType);
  }
}

