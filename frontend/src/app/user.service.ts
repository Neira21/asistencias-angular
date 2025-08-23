import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

interface UserResponse {
  message: string;
  users: User[];
}

interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  getUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>('http://localhost:3000/users');
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:3000/users', user);
  }
}
