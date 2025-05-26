import { Component, OnInit } from '@angular/core';
import { grupoDocente } from '../../model/grupos/grupoDto';
import { groupExam } from '../../model/exam/groupExamDto';
import { Message } from '../../model/message/messageDTO';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { userProfileDto } from '../../model/user/userProfileDTO';
import { StorageService } from '../../services/storage.service';
import { showAlert } from '../../model/alert';
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

  usuario?: userProfileDto;
  idUsuario: number=0;
  constructor(
    private router: Router,
    private examService: ExamService,
    private storageService: StorageService,
    private aRouter: ActivatedRoute

  ) { }

  ngOnInit(): void {
    const id = this.storageService.get('userId');
    this.idUsuario = Number(id);
    
    this.groupId = Number(this.aRouter.snapshot.paramMap.get('id'));
    //this.loadGroupDetails();
    this.loadGroupExams();
    console.log('id del usuario: ', this.idUsuario)
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
  //--------------METHOD TO CREATE A STUDENT EXAM------------------
  realizarExamen(idExamen: number): void {
    this.examService.generarExamenEstudiante(idExamen, this.idUsuario).subscribe({
      next: (resp: Message<number>) => {
        if (!resp.error) {
          // Redirige al componente del examen con los dos parámetros
          showAlert('Examen del estudiante cargado con exito', 'success');
          this.router.navigate(['/student', 'exam', idExamen, this.idUsuario]);
        } else {
          showAlert('Error: ' + resp.mensaje, 'error');
        }
      },
      error: (err) => {
        console.error(err);
        showAlert('Ocurrió un error al generar el examen.', 'error');
      }
    });
  }




} 
