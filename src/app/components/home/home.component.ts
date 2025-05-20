import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {loginDto} from '../../model/user/LoginDTO';
import { StorageService } from '../../services/storage.service';

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
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
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

    const loginDto:loginDto =  {
      correo: this.loginForm.value.username,
      contrasena: this.loginForm.value.password
    };

    if(this.loginForm.value.username=='student'&& this.loginForm.value.password=='1234567'){
       this.router.navigateByUrl('/student');
    }


    if(this.loginForm.value.username=='professor'&& this.loginForm.value.password=='1234567'){
       this.router.navigateByUrl('/professor');
    }


    console.log("user: ", loginDto )
    this.authService.login(loginDto).subscribe({

      next: (user) => {
        this.storageService.set('userId', user.respuesta.idUsuario.toString());
        if (user.respuesta.idRol === 3) {
          this.storageService.setUserRole(user.respuesta.idRol);
          this.router.navigateByUrl('/student');
        } else if (user.respuesta.idRol === 2) {
          this.storageService.setUserRole(user.respuesta.idRol);
          this.router.navigateByUrl('/professor');
        } else {
          this.errorMessage = 'Rol de usuario no reconocido.';
          alert('Error al obtener el rol del usuario'+ user.mensaje)
        }
        this.isLoading = false;
      }
      ,
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas o error del servidor.';
        alert('Error al obtener los datos del usuario'+ err.mensaje)
        this.isLoading = false
      }
      });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

}




