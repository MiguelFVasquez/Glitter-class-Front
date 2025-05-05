import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule,ReactiveFormsModule,FormArray } from '@angular/forms';

@Component({
  selector: 'app-question-board',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './question-board.component.html',
  styleUrl: './question-board.component.css'
})

export class QuestionBoardComponent {
  questionForm!: FormGroup;
  questionTypes = [
    'Selección múltiple única respuesta',
    'Selección múltiple múltiples respuestas',
    'Falso y verdadero',
    'Ordenar',
    'Emparejar',
    'Completar'
  ];
  topics = ['Matemáticas', 'Ciencias', 'Historia', 'Literatura', 'Programación'];
  categories = ['Conceptual', 'Procedimental', 'Actitudinal'];
  difficultyLevels = ['Baja', 'Media', 'Alta'];
  questions: any[] = [];
  selectedQuestionType = '';
  showQuestionForm = false;
  filterType = '';

  constructor(private fb: FormBuilder) {
    this.initializeForm();
    // Sample questions for demonstration
    this.questions = [
      {
        id: 1,
        enunciado: '¿Cuál es la capital de Francia?',
        tipo: 'Selección múltiple única respuesta',
        tema: 'Geografía',
        categoria: 'Conceptual',
        dificultad: 'Media',
        tiempo: 60,
        porcentaje: 10,
        publica: true
      },
      {
        id: 2,
        enunciado: '2+2=?',
        tipo: 'Selección múltiple única respuesta',
        tema: 'Matemáticas',
        categoria: 'Procedimental',
        dificultad: 'Baja',
        tiempo: 30,
        porcentaje: 5,
        publica: false
      }
    ];
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
      publica: [true, Validators.required],
      opciones: this.fb.array([]), // Will be dynamically managed based on question type
      pares: this.fb.array([]), // For matching questions
      elementosOrdenar: this.fb.array([]) // For ordering questions
    });

    this.questionForm.get('tipo')?.valueChanges.subscribe(type => {
      this.selectedQuestionType = type;
      this.updateFormForQuestionType();
    });
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

