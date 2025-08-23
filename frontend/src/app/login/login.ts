import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service'; // Corrected path
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-login',
  standalone: true, // Add standalone: true
  imports: [FormsModule, ReactiveFormsModule, CommonModule], // Add CommonModule
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent { // Renamed class to LoginComponent
  loginForm: FormGroup;
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else if (this.authService.isUser()) {
            this.router.navigate(['/user']);
          }
        },
        error: (error) => {
          if (error instanceof Error && error.message === 'SERVER_UNAVAILABLE') {
            this.errorMessage.set('El servidor no está disponible. Intente más tarde.');
          } else {
            this.errorMessage.set('Correo o contraseña inválidos.');
          }
        }
      });
    } else {
      this.errorMessage.set('Por favor ingrese un correo y contraseña válidos.');
    }
  }

  goRegister(): void {
    this.router.navigate(['/register']);

  }
}
