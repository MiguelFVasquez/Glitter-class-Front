import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
@Component({
  selector: 'app-professor-header',
  imports: [CommonModule,RouterModule],
  templateUrl: './professor-header.component.html',
  styleUrl: './professor-header.component.css'
})
export class ProfessorHeaderComponent {


  constructor(private router: Router) {}
  logout(): void {
    // Add your logout logic here
    console.log('Logging out...');
    this.router.navigate(['/']);
  }
}
