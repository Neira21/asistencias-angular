import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagementComponent implements OnInit { // Renamed class to UserManagementComponent
  private apiUrl = 'http://localhost:3000';
  users: User[] = [];
  userForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['USER', Validators.required] // Default role
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.http.get<User[]>(`${this.apiUrl}/users`).subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = error.error?.error || 'Failed to fetch users.';
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.http.post<User>(`${this.apiUrl}/register`, this.userForm.value).subscribe({
        next: (user) => {
          this.successMessage = `User ${user.email} created successfully!`;
          this.errorMessage = null;
          this.userForm.reset({ role: 'USER' }); // Reset form and set default role
          this.getUsers(); // Refresh user list
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.errorMessage = error.error?.error || 'Failed to create user.';
          this.successMessage = null;
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.successMessage = null;
    }
  }
}