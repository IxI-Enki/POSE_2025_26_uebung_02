import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TdListListComponent } from './pages/entities/data/td-list-list.component';
import { TdTaskListComponent } from './pages/entities/data/td-task-list.component';

const routes: Routes = [
  // Öffentlicher Login-Bereich
  { path: 'auth/login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Entities
  { path: 'entities/tdlists', component: TdListListComponent, canActivate: [AuthGuard] },
  { path: 'entities/tdtasks', component: TdTaskListComponent, canActivate: [AuthGuard] },

  // Redirect von leerem Pfad auf Dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Fallback bei ungültiger URL
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
