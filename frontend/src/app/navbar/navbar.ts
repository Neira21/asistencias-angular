import { Component, effect, OnInit, WritableSignal } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  isAdminUser: boolean = false;
  isRegularUser: boolean = false;

  constructor(public authService: AuthService) {
    effect(()=>{
      console.log(this.isAdminUser , this.isRegularUser)
    })
  } // Make authService public


  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.isAdminUser = user?.role === 'ADMIN';
      this.isRegularUser = user?.role === 'USER';
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
