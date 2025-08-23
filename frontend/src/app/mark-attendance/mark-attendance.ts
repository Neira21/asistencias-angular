import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mark-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mark-attendance.html',
  styleUrl: './mark-attendance.css'
})
export class MarkAttendanceComponent { // Renamed class to MarkAttendanceComponent
  private apiUrl = 'http://localhost:3000';
  attendanceMessage: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  protected user: any = null;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
   this.user = this.authService.currentUserValue;
  }

  markAttendance(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      this.attendanceMessage = 'User not logged in.';
      return;
    }

    this.http.post(`${this.apiUrl}/attendance/mark`, { userId }).subscribe({
      next: (response: any) => {
        this.attendanceMessage = response.message || 'Attendance marked successfully!';
      },
      error: (error) => {
        console.error('Error marking attendance:', error);
        this.attendanceMessage = error.error?.error || 'Failed to mark attendance.';
      }
    });
  }
}
