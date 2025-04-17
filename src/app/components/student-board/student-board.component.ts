import { Component } from '@angular/core';
import { StudentHeaderComponent } from "../student-header/student-header.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-board',
  imports: [CommonModule,RouterModule,StudentHeaderComponent],
  templateUrl: './student-board.component.html',
  styleUrl: './student-board.component.css'
})
export class StudentBoardComponent {

}
