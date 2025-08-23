import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Backend API URL
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user: Observable<User | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && storedUser !== 'undefined') {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  // verificar con console el register para que el usersubject tenga un valor

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.userSubject.next(response.user);
      }),
    );
  }

  register(email: string, password: string, role?: 'USER' | 'ADMIN'): Observable<AuthResponse> {
    const body = role ? { email, password, role } : { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, body).pipe(
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.userSubject.next(response.user);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUserValue() {
    return this.userSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user! && user.role === 'ADMIN';
  }

  isUser(): boolean {
    const user = this.currentUserValue;
    return user! && user.role === 'USER';
  }
}
