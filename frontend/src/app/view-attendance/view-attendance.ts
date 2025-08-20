import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

interface AttendanceRecord {
  id: number;
  userId: number;
  entryTime: string; // ISO string
  date: string; // ISO string
}

@Component({
  selector: 'app-view-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-attendance.html',
  styleUrl: './view-attendance.css'
})
export class ViewAttendanceComponent implements OnInit { // Renamed class to ViewAttendanceComponent
  private apiUrl = 'http://localhost:3000';
  attendanceRecords: AttendanceRecord[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.getAttendanceRecords();
  }

  getAttendanceRecords(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      this.errorMessage = 'User not logged in.';
      return;
    }

    this.http.get<AttendanceRecord[]>(`${this.apiUrl}/attendance/${userId}`).subscribe({
      next: (records) => {
        this.attendanceRecords = records.map(record => ({
          ...record,
          entryTime: new Date(record.entryTime).toLocaleString(), // Format for display
          date: new Date(record.date).toLocaleDateString() // Format for display
        }));
      },
      error: (error) => {
        console.error('Error fetching attendance records:', error);
        this.errorMessage = error.error?.error || 'Failed to fetch attendance records.';
      }
    });
  }
}