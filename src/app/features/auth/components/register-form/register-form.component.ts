import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
    relationshipStartDate: [null]
  });

  submitForm(): void {
    if (this.registerForm.valid) {
      const val = this.registerForm.value;
      const formatted = {
        ...val,
        relationshipStartDate: val.relationshipStartDate
          ? new Date(val.relationshipStartDate).toISOString().split('T')[0]
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
