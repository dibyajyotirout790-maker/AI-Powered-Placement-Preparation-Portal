import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Interview } from './pages/interview/interview';
import { Jobs } from './pages/jobs/jobs';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: Home
  },

  {
    path: 'jobs',
    component: Jobs
  },

  {
    path: 'interview',
    component: Interview
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: '**',
    redirectTo: 'home'
  }

];