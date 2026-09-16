import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashBoardServiceService } from '../../../dashboard/DashBoardService.service';
import { FileUploadService } from '../../../../core/services/file-upload.service';

interface UserInfo {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  gender: number;
  dateOfBirth: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
  pairCode: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzAvatarModule,
    NzIconModule,
    NzTagModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
  private dashBoardService = inject(DashBoardServiceService);
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);
  private fileUploadService = inject(FileUploadService);
  user = signal<UserInfo | undefined>(undefined);
  
  isVisible = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  editForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(6)]],
    bio: ['', [Validators.maxLength(100)]],
    dateOfBirth: [null, [Validators.required]],
    gender: [null, [Validators.required]],
    avatarUrl: [null],
    connectionCode: ['']
  });

  ngOnInit(): void {
    this.fetchProfileData();
  }
  
  fetchProfileData(): void {
    this.dashBoardService.getProfileUser().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.user.set(res.data);
          console.log('Thông tin user', this.user());
          this.patchFormValues(res.data);
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin user', err);
      }
    });
  }

  patchFormValues(data: UserInfo): void {
    this.editForm.patchValue({
      fullName: data.fullName,
      email: data.email,
      password: '', // Không patch password cũ ra
      bio: data.bio,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender,
      avatarUrl: data.avatarUrl,
      connectionCode: data.pairCode 
    });
  }

  getGenderLabel(gender?: number): string {
    if (gender === 1) return 'Nam';
    if (gender === 2) return 'Nữ';
    return 'Khác';
  }

  showEditModal(): void {
    if (this.user()) {
      this.patchFormValues(this.user()!);
    }
    this.isVisible.set(true);
  }

  handleCancel(): void {
    this.isVisible.set(false);
  }

  onAvatarChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.isUploading.set(true);
      this.fileUploadService.uploadFile(file).subscribe({
        next: (response: any) => {
          this.isUploading.set(false);
          const uploadedUrl = response.data || response.data || response;
          this.editForm.patchValue({ avatarUrl: uploadedUrl });
          this.message.success('Tải ảnh lên thành công!');
        },
        error: (err) => {
          this.isUploading.set(false);
          this.message.error('Lỗi khi tải ảnh lên.');
        }
      });
    }
  }

  handleOk(): void {
    if (this.editForm.valid) {
    this.isSaving.set(true);

    const val = this.editForm.value;

    let formattedData = {
        fullName: val.fullName,
        avatarUrl: val.avatarUrl || "",
        bio: val.bio || "",
        gender: val.gender,
        dateOfBirth: val.dateOfBirth
            ? new Date(val.dateOfBirth).toISOString().split('T')[0]
            : null,
        isVerified: this.user()?.isVerified ?? true,
        isActive: this.user()?.isActive ?? true,
    };
    // Chỉ gửi pairCode nếu người dùng thực sự thay đổi nó
    if (this.user()?.pairCode !== val.connectionCode) {
        formattedData = {
            ...formattedData,
            pairCode: val.connectionCode || ""
        } as any;
    }

    this.updateUser(formattedData);
} else {
      Object.values(this.editForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  updateUser(body: any){
    this.dashBoardService.updateUser(body).subscribe({
      next: (res) => {
        if(res.status === 200 || res.data){
          this.message.success('Cập nhật thông tin thành công! 💕')
          this.isVisible.set(false);
          this.isSaving.set(false);
          this.fetchProfileData();
          window.location.reload();
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
        this.isSaving.set(false);
      }
    })
  }
}
