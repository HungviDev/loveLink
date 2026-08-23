import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { FileUploadService } from '../../../../core/services/file-upload.service';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  location: string;
  description: string;
  category: 'first_meet' | 'date' | 'milestone' | 'trip';
  icon: string;
  color: string;
  photoUrl?: string;
}

@Component({
  selector: 'app-love-timeline',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzIconModule,
    NzTagModule,
    NzTimelineModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzButtonModule,
    NzGridModule,
    AppCardComponent
  ],
  templateUrl: './love-timeline.component.html',
  styleUrl: './love-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoveTimelineComponent {
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);
  private fileUploadService = inject(FileUploadService);

  events = signal<TimelineEvent[]>([
    {
      id: '1',
      date: 'Feb 14, 2023',
      title: 'Lần Đầu Gặp Nhau (First Meet)',
      location: 'Quán Coffee Sài Gòn ☕',
      description: 'Lần đầu chạm ánh mắt nhau ở góc quán quen thuộc. Anh vẫn nhớ nụ cười tươi tắn của em ngày hôm ấy!',
      category: 'first_meet',
      icon: 'heart',
      color: '#ff4b72',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '2',
      date: 'May 20, 2023',
      title: 'Lời Tỏ Tình Nhẹ Nhàng (First Proposal)',
      location: 'Bờ hồ Hoàng hôn 🌅',
      description: 'Anh lấy hết can đảm ngỏ lời và em đã gật đầu đồng ý. Ngày chính thức nắm tay bước cùng nhau!',
      category: 'milestone',
      icon: 'trophy',
      color: '#a855f7'
    },
    {
      id: '3',
      date: 'Feb 14, 2024',
      title: 'Kỷ Niệm 1 Năm Tại Paris (1st Anniversary)',
      location: 'Tháp Eiffel, Paris 🗼',
      description: 'Chuyến đi trong mơ đánh dấu mốc 365 ngày bên nhau tròn đầy tình yêu.',
      category: 'trip',
      icon: 'environment',
      color: '#3b82f6',
      photoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '4',
      date: 'June 20, 2024',
      title: 'Dọn Về Chung Mái Nhà (Shared Apartment)',
      location: 'Căn hộ mới ngập tràn ánh nắng 🏡',
      description: 'Cùng nhau trang trí từng góc nhỏ, bắt đầu chuỗi ngày chuẩn bị bữa sáng cho nhau!',
      category: 'milestone',
      icon: 'home',
      color: '#10b981'
    }
  ]);

  isModalVisible = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isUploading = signal<boolean>(false); 

  memoryForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    date: [null, [Validators.required]],
    description: ['', [Validators.required]],
    location: ['', [Validators.required]],
    photoUrl: ['']
  });

  openAddModal(): void {
    this.memoryForm.reset({
      title: '',
      date: null,
      description: '',
      location: '',
      photoUrl: ''
    });
    this.isModalVisible.set(true);
  }

  closeAddModal(): void {
    this.isModalVisible.set(false);
  }

  onPhotoChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.isUploading.set(true);
      this.fileUploadService.uploadFile(file).subscribe({
        next: (response: any) => {
          this.isUploading.set(false);
          const uploadedUrl = response.data || response;
          this.memoryForm.patchValue({ photoUrl: uploadedUrl });
          console.log('Uploaded photo URL:', this.memoryForm);
          this.message.success('Tải ảnh lên thành công! 📸');
        },
        error: (err) => {
          this.isUploading.set(false);
          this.message.error('Lỗi khi tải ảnh lên.');
          console.error(err);
        }
      });
    }
  }

  removePhoto(): void {
    this.memoryForm.patchValue({ photoUrl: '' });
  }

  submitMemory(): void {
    if (this.memoryForm.invalid) {
      Object.values(this.memoryForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.isSaving.set(true);
    const val = this.memoryForm.value;

    let dateStr = '';
    if (val.date) {
      try {
        dateStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(val.date));
      } catch (e) {
        dateStr = val.date.toString();
      }
    }

    const newEv: TimelineEvent = {
      id: Date.now().toString(),
      date: dateStr,
      title: val.title,
      location: val.location || 'Địa điểm lãng mạn 📍',
      description: val.description,
      category: 'milestone',
      icon: 'heart',
      color: '#ff4b72',
      photoUrl: val.photoUrl || undefined
    };

    setTimeout(() => {
      this.events.update((evs) => [newEv, ...evs]);
      this.isSaving.set(false);
      this.isModalVisible.set(false);
      this.message.success('Đã lưu kỷ niệm ngọt ngào mới! 💕');
    }, 600);
  }
}

