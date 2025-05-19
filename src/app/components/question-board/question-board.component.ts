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
@Component({
  selector: 'app-question-board',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './question-board.component.html',
  styleUrl: './question-board.component.css'
})

export class QuestionBoardComponent implements OnInit {
  questionForm!: FormGroup;
  //Information about question
  categories: categoria[] = [];
  difficultyLevels: dificultad[] = [];
  questionTypes: tipoPregunta[] = [];
  visibiliy: visibility[]=[];
  //questions
  questions: readPublicQuestion[] = []; //All public questions
  professorQuestio: readPublicQuestion[]=[] //All professor questions publics and privates
  selectedQuestionType = '';
  showQuestionForm = false;
  filterType = '';
  //id
  idUsuario:number=0;

  constructor(
    private fb: FormBuilder,
    private publicService:PublicService,
    private storageService: StorageService,
    private questionService: QuestionService) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.questionForm = this.fb.group({
      enunciado: ['', Validators.required],
      tipo: ['', Validators.required],
      tema: ['', Validators.required],
      categoria: ['', Validators.required],
      dificultad: ['', Validators.required],
      tiempoMaximo: [60, [Validators.required, Validators.min(10)]],
      porcentaje: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
      visibilidadId: [null, Validators.required],
      opciones: this.fb.array([]), // Will be dynamically managed based on question type
      pares: this.fb.array([]), // For matching questions
      elementosOrdenar: this.fb.array([]) // For ordering questions
    });

    this.questionForm.get('tipo')?.valueChanges.subscribe(type => {
      this.selectedQuestionType = type;
      this.updateFormForQuestionType();
    });
  }

  ngOnInit(): void {
    const id = this.storageService.get('userId');
    this.idUsuario = Number(id);
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
  }


  //Method to get all themes
  loadThemes(){
    this.publicService.getTemas().subscribe({
      next: resp => {
        if (!resp.error) {
          this.categories = resp.respuesta;
        }else{
          console.warn ('Error en getCategorias')
        }
      },
      error: () => console.error('Error cargando categorías')
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
        }
      },
      error :err => console.error('Error al cargar las dificultades', err)
    })
  }

  //Method to load all public questions
  loadPublicQuestions(){
    this.publicService.getPublicQuestions().subscribe({
      next: resp => {
        if(!resp.error){
          this.questions=resp.respuesta;
        }else{
          console.warn('Error en getPublicQuestions')
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
          this.questions=resp.respuesta;
        }else{
          console.warn('Error en get professor question')
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

  onSubmit(): void {
    if (this.questionForm.valid) {
      const newQuestion = {
        id: this.questions.length + 1,
        ...this.questionForm.value,
        // Process dynamic fields based on type
        opciones: this.selectedQuestionType.includes('Selección múltiple') ||
                 this.selectedQuestionType === 'Falso y verdadero'
                 ? this.opciones.value : null,
        pares: this.selectedQuestionType === 'Emparejar' ? this.pares.value : null,
        elementosOrdenar: this.selectedQuestionType === 'Ordenar' ? this.elementosOrdenar.value : null
      };

      this.questions.unshift(newQuestion);
      this.questionForm.reset();
      this.showQuestionForm = false;
      this.selectedQuestionType = '';
    }
  }

   loadSampleQuestions(): void {
    this.questions = [
      // ... existing sample questions
    ];
  }
  get filteredQuestions() {
    if (!this.filterType) return this.questions;
    return this.questions.filter(q => q.tipo === this.filterType);
  }
}

