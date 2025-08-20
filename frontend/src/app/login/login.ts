import { Component } from '@angular/core';
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
  errorMessage: string | null = null;

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
          console.log('Login successful', response);
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else if (this.authService.isUser()) {
            this.router.navigate(['/user']);
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Invalid email or password.';
        }
      });
    } else {
      this.errorMessage = 'Please enter valid email and password.';
    }
  }
}