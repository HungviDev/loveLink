import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AuthStore } from '../../store/auth.store';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzIconModule,
    RegisterFormComponent,
    AppCardComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  authStore = inject(AuthStore);

  onRegister(payload: RegisterRequest): void {
    this.authStore.register(payload);
  }
}
