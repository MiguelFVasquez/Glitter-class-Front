import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { readExam } from '../../model/exam/readExamDto';
import { PublicService } from '../../services/public.service';
import { ExamService } from '../../services/exam.service';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-exam-board',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam-board.component.html',
  styleUrl: './exam-board.component.css'
})
export class ExamBoardComponent implements OnInit {
  
  //Exams
  exams: readExam[] = [];
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

    //Load exams
    this.loadExams(this.idUsuario);
  }
  
  //Method to get all professor exams
  loadExams(id:number){
    this.examService.getExams(id).subscribe({
      next: resp =>{
        if(!resp.error){
          this.exams=resp.respuesta;
        }else{
          alert('Error al obtener los examenes'+ resp.mensaje)
          console.warn('Error en getExam')
        }
      },
      error:err => {
        console.log('Error al cargar los examenes', err)
        alert('Error al obtener los examenes'+ err.mensaje)
      
      }
    })
  }



}
