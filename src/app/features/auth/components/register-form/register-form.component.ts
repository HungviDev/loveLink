import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { RegisterRequest } from '../../models/auth.model';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzIconModule,
    NzSelectModule,
    AppButtonComponent
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent {
  private fb = inject(FormBuilder);

  loading = input<boolean>(false);
  errorMessage = input<string | null>(null);

  formSubmit = output<RegisterRequest>();

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    dateOfBirth: [null, [Validators.required]],
    gender: [null, [Validators.required]],
    avatarUrl: ['', [Validators.pattern(/https?:\/\/.+/)]],
    bio: ['', [Validators.maxLength(100)]]
  });

  submitForm(): void {
    if (this.registerForm.valid) {
      const val = this.registerForm.value;
      const formatted = {
        ...val,
        dateOfBirth: val.dateOfBirth
          ? new Date(val.dateOfBirth).toISOString().split('T')[0]
          : undefined
      };
      this.formSubmit.emit(formatted);
    } else {
      Object.values(this.registerForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
