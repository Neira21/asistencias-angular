import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar'; // Import NavbarComponent
import { RouterOutlet } from '@angular/router'; // Import RouterOutlet

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet], // Add NavbarComponent and RouterOutlet to imports
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboardComponent {

}