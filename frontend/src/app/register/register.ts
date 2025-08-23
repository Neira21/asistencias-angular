import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service'; // Corrected path
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-register',
  standalone: true, // Add standalone: true
  imports: [FormsModule, ReactiveFormsModule, CommonModule], // Add CommonModule
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent { // Renamed class to RegisterComponent
  registerForm: FormGroup;
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: [null] // Make role optional, default to null
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {

      const { email, password, role } = this.registerForm.value;
      const roleToSend = role === '' ? undefined : role;
      console.log('Registering user:', { email, password, role });
      this.authService.register(email, password, roleToSend).subscribe({
        // Se puede usar el response.user.role y ya no el auhthService.isAdmin() o isUser()
        next: (response) => {
          console.log('Register response:', response);
          if (response.user.role === 'ADMIN') {
            console.log('Redirecting to admin dashboard');
            this.router.navigate(['/admin']);
          } else if (response.user.role === 'USER') {
            console.log('Redirecting to user dashboard');
            this.router.navigate(['/user']);
          }
        },
        error: (error) => {
          if (error instanceof Error && error.message === 'SERVER_UNAVAILABLE') {
            this.errorMessage.set('El servidor no está disponible. Intente más tarde.');
          }
        }
      });
    } else {
      this.errorMessage.set('Por favor ingrese un correo y contraseña válidos.');
    }
  }
}
