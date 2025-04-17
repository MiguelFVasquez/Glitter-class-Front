import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule,Router } from '@angular/router';


@Component({
  selector: 'app-student-header',
  imports: [CommonModule,RouterModule],
  templateUrl: './student-header.component.html',
  styleUrl: './student-header.component.css'
})
export class StudentHeaderComponent {

  constructor(private router: Router) {}

  logout(): void {
    // Add your logout logic here
    console.log('Logging out...');
    this.router.navigate(['/']);
  }
}
