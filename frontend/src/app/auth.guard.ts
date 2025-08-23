import { inject, Injectable } from '@angular/core';
import { CanActivateFn, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


export const AuthGuard: CanActivateFn = (route, state) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const router = inject(Router);

  console.log(route, state)

  if(currentUser) {
    if (state.url === '/login') {
      if (currentUser.role === 'ADMIN') {
        return router.navigateByUrl('/admin');
      } else if (currentUser.role === 'USER') {
        return router.navigateByUrl('/user');
      }
    }
  }

  return true;
};
