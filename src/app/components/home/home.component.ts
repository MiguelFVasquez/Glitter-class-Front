import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { showAlert } from '../../model/alert';


@Component({
  selector: 'app-home',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

    onSubmit(): void {
      if (this.loginForm.invalid) {
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value; //Auth service, is not yet
      
      if (username === 'student@gmail.com' && password === 'student1234') {
        //  redirect to 'student' component if the credential are correct
        this.router.navigateByUrl('/student');
      }else if(username === 'professor@gmail.com' && password === 'professor1234'){
        //Redirect to 'professor ' component
        this.router.navigateByUrl('/professor');
      }else {
        //  Error messagge if the credentials are incorrect
        showAlert('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    } 
    
    /*
    this.authService.login(username, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Login failed. Please try again.';
      }
    });*/

    get username() {
      return this.loginForm.get('username');
    }
  
    get password() {
      return this.loginForm.get('password');
    } 
  
  }




