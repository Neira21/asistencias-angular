import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { UserDashboardComponent } from './user-dashboard/user-dashboard';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance';
import { ViewAttendanceComponent } from './view-attendance/view-attendance';
import { UserManagementComponent } from './user-management/user-management';
import { RegisterComponent } from './register/register';
import { ProfileComponent } from './profile/profile'
import { AuthGuard } from './auth.guard'; // Import AuthGuard
import { RoleGuard } from './role.guard'; // Import RoleGuard

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] }, // Apply AuthGuard
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'ADMIN' }, // Requerir rol ADMIN
    children: [
      { path: '', redirectTo: 'mark-attendance', pathMatch: 'full' },
      { path: 'mark-attendance', component: MarkAttendanceComponent },
      { path: 'view-attendance', component: ViewAttendanceComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
  {
    path: 'user',
    component: UserDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'USER' }, // Requerir rol USER
    children: [
      { path: '', redirectTo: 'mark-attendance', pathMatch: 'full' },
      { path: 'mark-attendance', component: MarkAttendanceComponent },
      { path: 'view-attendance', component: ViewAttendanceComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
];
