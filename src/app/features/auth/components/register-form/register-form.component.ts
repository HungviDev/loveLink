import { Component, ChangeDetectionStrategy, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';

import { RegisterRequest } from '../../models/auth.model';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { FileUploadService } from '../../../../core/services/file-upload.service';

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
  private fileUploadService = inject(FileUploadService);
  private message = inject(NzMessageService);

  loading = input<boolean>(false);
  errorMessage = input<string | null>(null);
  
  isUploading = signal<boolean>(false);

  formSubmit = output<RegisterRequest>();
  selectedFileUrl = signal<string | null>(null);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    dateOfBirth: [null, [Validators.required]],
    gender: [null, [Validators.required]],
    avatarFile: [null], // Form giờ sẽ lưu trữ URL ảnh trả về từ server
    connectionCode: [''],
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

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.isUploading.set(true);
      this.fileUploadService.uploadFile(file).subscribe({
        next: (response: any) => {
          this.isUploading.set(false);
          const uploadedUrl = response.data;
          this.selectedFileUrl.set(uploadedUrl);
          this.registerForm.patchValue({
            avatarFile: uploadedUrl
          });
          this.message.success('Upload ảnh thành công!');
        },
        error: (err) => {
          this.isUploading.set(false);
          this.message.error('Upload ảnh thất bại!');
          console.error(err);
        }
      });
    }
    target.value = '';
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.selectedFileUrl.set(null);
    this.registerForm.patchValue({
      avatarFile: null
    });
  }
}
