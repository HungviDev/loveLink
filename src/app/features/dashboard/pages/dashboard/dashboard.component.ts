import { Component, ChangeDetectionStrategy, signal, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../../../../core/services/auth.service';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppStatCardComponent } from '../../../../shared/ui/app-stat-card/app-stat-card.component';
import { AppAvatarComponent } from '../../../../shared/ui/app-avatar/app-avatar.component';

export interface CoupleMood {
  emoji: string;
  label: string;
  color: string;
}

export interface LoveNote {
  id: string;
  author: string;
  content: string;
  time: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NzGridModule,
    NzIconModule,
    NzTagModule,
    NzTooltipModule,
    AppCardComponent,
    AppStatCardComponent,
    AppAvatarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private message = inject(NzMessageService);

  currentUser = this.authService.currentUser;

  // Signal state
  daysTogether = signal<number>(520);
  memoriesCount = signal<number>(148);
  upcomingEventsCount = signal<number>(3);
  chatMessagesCount = signal<number>(1240);

  // Live Anniversary Countdown Signals
  countdownDays = signal<number>(14);
  countdownHours = signal<number>(8);
  countdownMins = signal<number>(32);
  countdownSecs = signal<number>(45);

  private timerInterval: any;

  // Interactive Mood Selector State
  moodOptions: CoupleMood[] = [
    { emoji: '🥰', label: 'So in Love', color: '#ff4b72' },
    { emoji: '😘', label: 'Missing You', color: '#a855f7' },
    { emoji: '🤗', label: 'Need a Hug', color: '#ff9000' },
    { emoji: '🥳', label: 'Excited', color: '#10b981' },
    { emoji: '☕', label: 'Chill & Relax', color: '#3b82f6' }
  ];

  myMood = signal<CoupleMood>(this.moodOptions[0]);
  partnerMood = signal<CoupleMood>(this.moodOptions[1]);

  // Interactive Sticky Love Notes State
  loveNotes = signal<LoveNote[]>([
    { id: '1', author: 'Sophia', content: 'Chúc anh một ngày làm việc thật vui vẻ nha! Yêu anh 💕', time: '10:15 AM', color: '#fff3c4' },
    { id: '2', author: 'Alex', content: 'Tối nay 7h anh qua đón em đi ăn món em thích nhé! 🍕', time: '11:40 AM', color: '#ffd0e0' }
  ]);
  newNoteInput = signal<string>('');

  // Virtual Hug Burst Animation State
  isBursting = signal<boolean>(false);

  partnerName = computed(() => this.currentUser()?.partnerName || 'Sophia Miller');
  partnerAvatar = computed(() => this.currentUser()?.partnerAvatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80');

  ngOnInit(): void {
    this.startCountdownTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  selectMood(mood: CoupleMood): void {
    this.myMood.set(mood);
    this.message.success(`Đã cập nhật trạng thái cảm xúc: ${mood.emoji} ${mood.label}`);
  }

  addLoveNote(): void {
    const text = this.newNoteInput().trim();
    if (!text) return;

    const colors = ['#fff3c4', '#ffd0e0', '#d8f3dc', '#e0e7ff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const note: LoveNote = {
      id: Date.now().toString(),
      author: 'Alex',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: randomColor
    };

    this.loveNotes.update((notes) => [note, ...notes]);
    this.newNoteInput.set('');
    this.message.success('Đã dán ghi chú tình yêu mới! 📌');
  }

  deleteLoveNote(id: string): void {
    this.loveNotes.update((notes) => notes.filter((n) => n.id !== id));
  }

  triggerVirtualHug(): void {
    this.isBursting.set(true);
    this.message.success('Đã gửi một cái ôm thật chặt và hàng ngàn trái tim tới Sophia! 🤗💖');

    setTimeout(() => {
      this.isBursting.set(false);
    }, 2500);
  }

  private startCountdownTimer(): void {
    this.timerInterval = setInterval(() => {
      let secs = this.countdownSecs() - 1;
      if (secs < 0) {
        secs = 59;
        let mins = this.countdownMins() - 1;
        if (mins < 0) {
          mins = 59;
          let hrs = this.countdownHours() - 1;
          if (hrs < 0) {
            hrs = 23;
          }
          this.countdownHours.set(hrs);
        }
        this.countdownMins.set(mins);
      }
      this.countdownSecs.set(secs);
    }, 1000);
  }
}
