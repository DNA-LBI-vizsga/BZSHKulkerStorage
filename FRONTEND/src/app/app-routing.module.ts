import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { NavbarComponent } from './components/navbar/navbar.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path:'navbar', component: NavbarComponent, canActivate: [authGuard], 
    children: [
      {path: 'register', component: RegisterComponent, canActivate: [authGuard]},
      {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]}
    ]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
