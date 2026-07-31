import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AuthStore } from '../../store/auth.store';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzIconModule,
    LoginFormComponent,
    AppCardComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  authStore = inject(AuthStore);

  onLogin(credentials: LoginRequest): void {
    this.authStore.login(credentials);
  }
}
