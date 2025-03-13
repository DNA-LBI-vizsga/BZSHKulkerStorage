import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CreateComponent } from './components/create/create.component';
import { UpdateComponent } from './components/update/update.component';
import { DeleteComponent } from './components/delete/delete.component';
import { AdminComponent } from './components/admin/admin.component';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { adminGuard } from './guards/admin.guard';
import { firstLoginGuard } from './guards/first-login.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'passwordchange', component: PasswordChangeComponent, canActivate: [authGuard]},
  {path:'navbar', component: NavbarComponent, canActivate: [authGuard, firstLoginGuard], 
    children: [
      {path: 'register', component: RegisterComponent, canActivate: [authGuard,adminGuard]},
      {path: 'admin', component: AdminComponent, canActivate: [authGuard,adminGuard]},
      {path: 'create' , component: CreateComponent, canActivate: [authGuard]},
      //{path: 'update', component: UpdateComponent, canActivate: [authGuard,adminGuard]},
      //{path: 'delete', component: DeleteComponent, canActivate: [authGuard,adminGuard]}
    ]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
