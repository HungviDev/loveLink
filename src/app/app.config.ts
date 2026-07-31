import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import {
  AppstoreFill,
  HeartFill,
  HeartOutline,
  CompassFill,
  PictureFill,
  MessageFill,
  CheckCircleFill,
  CalendarFill,
  CalendarOutline,
  GiftFill,
  MenuUnfoldOutline,
  MenuFoldOutline,
  DownOutline,
  UserOutline,
  LogoutOutline,
  DashboardOutline,
  TrophyFill,
  HomeFill,
  EnvironmentFill,
  CameraOutline,
  MessageOutline,
  PlusOutline,
  FireFill,
  SmileOutline,
  CheckSquareOutline,
  BgColorsOutline,
  CheckOutline,
  LinkOutline,
  RightOutline,
  CopyOutline,
  CloseCircleFill,
  LoadingOutline,
  SendOutline,
  CloseOutline
} from '@ant-design/icons-angular/icons';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

registerLocaleData(en);

const icons = [
  AppstoreFill,
  HeartFill,
  HeartOutline,
  CompassFill,
  PictureFill,
  MessageFill,
  CheckCircleFill,
  CalendarFill,
  CalendarOutline,
  GiftFill,
  MenuUnfoldOutline,
  MenuFoldOutline,
  DownOutline,
  UserOutline,
  LogoutOutline,
  DashboardOutline,
  TrophyFill,
  HomeFill,
  EnvironmentFill,
  CameraOutline,
  MessageOutline,
  PlusOutline,
  FireFill,
  SmileOutline,
  CheckSquareOutline,
  BgColorsOutline,
  CheckOutline,
  LinkOutline,
  RightOutline,
  CopyOutline,
  CloseCircleFill,
  LoadingOutline,
  SendOutline,
  CloseOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideNzI18n(en_US),
    provideNzIcons(icons)
  ]
};
