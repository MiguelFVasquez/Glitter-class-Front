import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { readExam } from '../../model/exam/readExamDto';
import { PublicService } from '../../services/public.service';
import { error } from 'console';

@Component({
  selector: 'app-exam-board',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam-board.component.html',
  styleUrl: './exam-board.component.css'
})
export class ExamBoardComponent implements OnInit {
  exams: readExam[] = [];

  constructor(private publicService: PublicService){}
  
  ngOnInit(): void {
    this.loadExams();
  }
  
  
  loadExams(){
    this.publicService.getExams().subscribe({
      next: resp =>{
        if(!resp.error){
          this.exams=resp.respuesta;
        }else{
          console.warn('Error en getExam')
        }
      },
      error:err => console.log('Error al cargar los examenes', err)
    })
  }



}
