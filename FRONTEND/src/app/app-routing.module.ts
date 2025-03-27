import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserControlComponent } from './components/user-control/user-control.component';
import { authGuard } from './guards/auth.guard';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { adminGuard } from './guards/admin.guard';
import { firstLoginGuard } from './guards/first-login.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'passwordchange', component: PasswordChangeComponent, canActivate: [authGuard]},
  //{path:'navbar', component: NavbarComponent, canActivate: [authGuard, firstLoginGuard]},
  {path: 'users', component: UserControlComponent, canActivate: [authGuard,adminGuard, firstLoginGuard]},
  {path: 'dashboard' , component: DashboardComponent, canActivate: [authGuard, firstLoginGuard]},
  {path: '**', redirectTo: 'login', pathMatch: 'full'},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
