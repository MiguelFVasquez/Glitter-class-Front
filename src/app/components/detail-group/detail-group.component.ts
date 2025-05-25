import { Component, OnInit } from '@angular/core';
import { grupoDocente } from '../../model/grupos/grupoDto';
import { groupExam } from '../../model/exam/groupExamDto';
import { Message } from '../../model/message/messageDTO';
import { PublicService } from '../../services/public.service';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-detail-group',
  imports: [CommonModule,RouterModule],
  templateUrl: './detail-group.component.html',
  styleUrl: './detail-group.component.css'
})
export class DetailGroupComponent implements OnInit {
  groupId: number = 0;
  groupDetails: grupoDocente | null = null;
  exams: groupExam[] = [];
  loading: boolean = true;
  error: string | null = null;


  constructor(
    private router: Router,
    private examService: ExamService,
    private aRouter: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.groupId = Number(this.aRouter.snapshot.paramMap.get('id'));
    //this.loadGroupDetails();
    this.loadGroupExams();
  }

  /*
  loadGroupDetails() {
    // Asumiendo que tienes un servicio para obtener los detalles del grupo
    this.publicService.getGroupDetails(this.groupId).subscribe({
      next: (response) => {
        if (!response.error) {
          this.groupDetails = response.respuesta;
        } else {
          this.error = 'Error al cargar los detalles del grupo';
        }
      },
      error: (err) => {
        this.error = 'Error de conexión al cargar los detalles del grupo';
        console.error(err);
      }
    });
  }*/ 
  //----------------Load information-------------------
  
  //Method to load all group exams
  loadGroupExams() {
    this.examService.getGroupExam(this.groupId).subscribe({
      next: (response: Message<groupExam[]>) => {
        if (!response.error) {
          this.exams = response.respuesta;
        } else {
          this.error = 'Error al cargar los exámenes del grupo';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error de conexión al cargar los exámenes del grupo';
        this.loading = false;
        console.error(err);
      }
    });
  }
  //Method to format the exam date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });  
  }

  //-----------Navegacion----------
  goBack() {
    this.router.navigate(['/student/groups']);
  }



} 
