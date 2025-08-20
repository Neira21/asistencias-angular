import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar'; // Import NavbarComponent
import { RouterOutlet } from '@angular/router'; // Import RouterOutlet

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet], // Add NavbarComponent and RouterOutlet to imports
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent {

}