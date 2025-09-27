import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TdListListComponent } from './pages/entities/data/td-list-list.component';
import { TdTaskListComponent } from './pages/entities/data/td-task-list.component';
import { TdTaskCardsComponent } from './pages/entities/data/td-task-cards.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Auth
  { path: 'auth/login', component: LoginComponent },

  // Dashboard
  { path: 'dashboard', component: DashboardComponent },

  // Entities
  { path: 'entities/tdlists', component: TdListListComponent, canActivate: [AuthGuard] },
  { path: 'entities/tdtasks', component: TdTaskListComponent, canActivate: [AuthGuard] },
  { path: 'entities/tdtask-cards', component: TdTaskCardsComponent, canActivate: [AuthGuard] },

  // Redirect von leerem Pfad auf Dashboard
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
