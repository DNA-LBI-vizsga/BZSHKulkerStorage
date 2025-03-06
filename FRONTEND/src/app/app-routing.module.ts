import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CreateComponent } from './components/create/create.component';
import { UpdateComponent } from './components/update/update.component';
import { DeleteComponent } from './components/delete/delete.component';
import { AdminComponent } from './components/admin/admin.component';
import { PasswordChangeComponent } from './components/password-change/password-change.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'passwordChange', component: PasswordChangeComponent},
  {path:'navbar', component: NavbarComponent, canActivate: [authGuard], 
    children: [
      {path: 'register', component: RegisterComponent, canActivate: [authGuard]},
      {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
      {path: 'admin', component: AdminComponent, canActivate: [authGuard]},
      {path: 'create' , component: CreateComponent, canActivate: [authGuard]},
      {path: 'update', component: UpdateComponent, canActivate: [authGuard]},
      {path: 'delete', component: DeleteComponent, canActivate: [authGuard]}
    ]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
