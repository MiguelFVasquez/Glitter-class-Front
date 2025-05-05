import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule,ReactiveFormsModule } from '@angular/forms';

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
      opciones: this.fb.array([]) // Will be dynamically managed based on question type
    });

    this.questionForm.get('tipo')?.valueChanges.subscribe(type => {
      this.selectedQuestionType = type;
      this.updateFormForQuestionType();
    });
  }

  updateFormForQuestionType(): void {
    // Here you would add/remove form controls based on question type
    // For example, add options field for multiple choice questions
    console.log('Question type changed to:', this.selectedQuestionType);
  }

  toggleQuestionForm(): void {
    this.showQuestionForm = !this.showQuestionForm;
    if (!this.showQuestionForm) {
      this.questionForm.reset();
      this.selectedQuestionType = '';
    }
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      const newQuestion = {
        id: this.questions.length + 1,
        ...this.questionForm.value
      };
      this.questions.unshift(newQuestion);
      this.questionForm.reset();
      this.showQuestionForm = false;
      this.selectedQuestionType = '';
    }
  }

  get filteredQuestions() {
    if (!this.filterType) return this.questions;
    return this.questions.filter(q => q.tipo === this.filterType);
  }
}

