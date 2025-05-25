import { Component, OnInit } from '@angular/core';
import { grupoDocente } from '../../model/grupos/grupoDto';
import { groupExam } from '../../model/exam/groupExamDto';
import { Message } from '../../model/message/messageDTO';
import { PublicService } from '../../services/public.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-detail-group',
  imports: [CommonModule, MatIconModule,MatButtonModule, MatCardModule,MatProgressSpinnerModule,RouterModule],
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
    private route: ActivatedRoute,
    private publicService: PublicService,
    private examService: ExamService

  ) { }

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
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
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

} 
