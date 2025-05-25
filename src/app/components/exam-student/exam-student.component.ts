import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { ExamDetail } from '../../model/exam/examDetailDto';
import { ExamService } from '../../services/exam.service';

@Component({

  selector: 'app-exam-student',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './exam-student.component.html',
  styleUrl: './exam-student.component.css'
})
export class ExamStudentComponent {

  }
