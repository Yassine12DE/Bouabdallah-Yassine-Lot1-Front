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
import { StatisticsComponent } from '../back-office/statistics/statistics.component';
import { LoyaltyBadgeComponent } from '../front-office/loyalty-badge/loyalty-badge.component';

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
      //ADMIN COMPONENTS
      { path: 'user-list', component: UserListComponent },
      { path: 'statistics', component: StatisticsComponent },

      //ORGANIZER COMPONENT
      { path: 'event', component: EventComponent },
      { path: 'events-conflict', component: EventConflictsComponent },
      { path: 'reservation', component: ReservationComponent },

      //SHARED
      { path: 'profile', component: ProfileComponent },
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
      { path: 'loyalty-badge', component: LoyaltyBadgeComponent },
    ],
  },

  // other wrong routes
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];
