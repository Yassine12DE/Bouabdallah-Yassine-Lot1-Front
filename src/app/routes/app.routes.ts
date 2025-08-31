import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';

import { UserListComponent } from '../back-office/user-list/user-list.component';

import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { ProfileComponent } from '../back-office/profile/profile.component';

import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';
import { BackOfficeComponent } from '../back-office/back-office.component';
import { AuthComponent } from '../auth/auth.component';
import { EventComponent } from '../back-office/event/event.component';
import { ReservationComponent } from '../back-office/reservation/reservation.component';

import { RegisterComponent } from '../auth/register/register.component';
import { EventListComponent } from '../front-office/event-list/event-list.component';
import { FrontOfficeComponent } from '../front-office/front-office.component';
import { ReservationListComponent } from '../front-office/reservation-list/reservation-list.component';
import { EventDetailsComponent } from '../front-office/event-details/event-details.component';
import { EventConflictsComponent } from '../back-office/event-conflicts/event-conflicts.component';

export const routes: Routes = [
  // default route
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // auth routes
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
    ],
  },

  // Back Office components
  {
    path: 'main',
    component: BackOfficeComponent,
    children: [
      { path: '', redirectTo: 'event', pathMatch: 'full' },
      { path: 'user-list', component: UserListComponent },

      { path: 'profile', component: ProfileComponent },

      { path: 'event', component: EventComponent },

      { path: 'events-conflict', component: EventConflictsComponent },

      { path: 'reservation', component: ReservationComponent },
    ],
  },

  // Front Office components
  {
    path: 'home',
    component: FrontOfficeComponent,
    children: [
      { path: '', redirectTo: 'event-list', pathMatch: 'full' },
      { path: 'event-list', component: EventListComponent },
      { path: 'event-details/:id', component: EventDetailsComponent },
      { path: 'reservation-list', component: ReservationListComponent },
    ],
  },

  // other wrong routes
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];
