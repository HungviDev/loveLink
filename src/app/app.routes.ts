import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES)
      },
      {
        path: 'couple',
        loadComponent: () =>
          import('./features/couple/pages/couple-profile/couple-profile.component').then(
            (m) => m.CoupleProfileComponent
          )
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/user/pages/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent
          )
      },
      {
        path: 'timeline',
        loadComponent: () =>
          import('./features/timeline/pages/love-timeline/love-timeline.component').then(
            (m) => m.LoveTimelineComponent
          )
      },
      {
        path: 'album',
        loadComponent: () =>
          import('./features/album/pages/shared-album/shared-album.component').then(
            (m) => m.SharedAlbumComponent
          )
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./features/chat/pages/love-chat/love-chat.component').then(
            (m) => m.LoveChatComponent
          )
      },
      {
        path: 'todo',
        loadComponent: () =>
          import('./features/todo/pages/couple-todo/couple-todo.component').then(
            (m) => m.CoupleTodoComponent
          )
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/calendar/pages/couple-calendar/couple-calendar.component').then(
            (m) => m.CoupleCalendarComponent
          )
      },
      {
        path: 'invitaion',
        loadComponent: () =>
          import('./features/couple/components/pairing-invitations/pairing-invitations').then(
            (m) => m.PairingInvitations
          )
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
