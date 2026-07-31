import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../../../../core/services/auth.service';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppAvatarComponent } from '../../../../shared/ui/app-avatar/app-avatar.component';

@Component({
  selector: 'app-couple-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzGridModule,
    NzIconModule,
    NzTagModule,
    AppCardComponent,
    AppAvatarComponent
  ],
  templateUrl: './couple-profile.component.html',
  styleUrl: './couple-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoupleProfileComponent {
  private authService = inject(AuthService);
  private message = inject(NzMessageService);

  currentUser = this.authService.currentUser;

  relationshipStatus = signal<string>('Connected & In Love 💕');
  startDate = signal<string>('February 14, 2023');
  loveMotto = signal<string>('"Trong vạn người, anh chỉ chọn mình em. Cùng nhau đi hết đoạn đường đời này nhé!"');

  userBio = signal<string>('Yêu thích đi du lịch, xem phim rạp và cùng nhau làm món ngon mỗi cuối tuần 🥐');
  partnerBio = signal<string>('Thích chụp ảnh lưu giữ kỷ niệm, uống trà sữa béo ngậy và đi dạo dải ngân hà với anh ✨');

  userTags = signal<string[]>(['Travel Lover ✈️', 'Coffee Addict ☕', 'Movie Fan 🎬']);
  partnerTags = signal<string[]>(['Photography 📷', 'Baking 🥐', 'Romantic Heart 💖']);

  partnerName = computed(() => this.currentUser()?.partnerName || 'Sophia Miller');
  partnerAvatar = computed(() => this.currentUser()?.partnerAvatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80');

  saveLoveMotto(): void {
    this.message.success('Đã lưu châm ngôn tình yêu thành công! 💕');
  }
}
