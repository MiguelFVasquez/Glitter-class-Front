import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfessorHeaderComponent } from "../professor-header/professor-header.component";

@Component({
  selector: 'app-professor-board',
  imports: [RouterModule, ProfessorHeaderComponent],
  templateUrl: './professor-board.component.html',
  styleUrl: './professor-board.component.css'
})
export class ProfessorBoardComponent {

}
