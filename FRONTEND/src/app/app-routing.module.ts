import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserControlComponent } from './components/user-control/user-control.component';
import { authGuard } from './guards/auth.guard';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminComponent } from './components/admin/admin.component';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { adminGuard } from './guards/admin.guard';
import { firstLoginGuard } from './guards/first-login.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'passwordchange', component: PasswordChangeComponent, canActivate: [authGuard]},
  {path:'navbar', component: NavbarComponent, canActivate: [authGuard, firstLoginGuard], 
    children: [
      {path: 'register', component: UserControlComponent, canActivate: [authGuard,adminGuard]},
      {path: 'admin', component: AdminComponent, canActivate: [authGuard,adminGuard]},
      {path: 'dashboard' , component: DashboardComponent, canActivate: [authGuard]},
      {path: 'list', component: ListComponent, canActivate: [authGuard]}
    ]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
