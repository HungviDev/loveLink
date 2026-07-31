import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';

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
    FormsModule,
    NzIconModule,
    NzTagModule,
    NzTimelineModule,
    AppCardComponent
  ],
  templateUrl: './love-timeline.component.html',
  styleUrl: './love-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoveTimelineComponent {
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

  newTitle = signal<string>('');
  newDate = signal<string>('');
  newDesc = signal<string>('');

  addTimelineEvent(): void {
    if (!this.newTitle() || !this.newDate()) return;

    const newEv: TimelineEvent = {
      id: Date.now().toString(),
      date: this.newDate(),
      title: this.newTitle(),
      location: 'Địa điểm lãng mạn 📍',
      description: this.newDesc() || 'Kỷ niệm đẹp đáng nhớ!',
      category: 'date',
      icon: 'heart',
      color: '#ff4b72'
    };

    this.events.update((evs) => [newEv, ...evs]);
    this.newTitle.set('');
    this.newDate.set('');
    this.newDesc.set('');
  }
}
