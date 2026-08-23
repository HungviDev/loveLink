import { DashBoardServiceService } from './../../DashBoardService.service';
import { Component, ChangeDetectionStrategy, signal, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppStatCardComponent } from '../../../../shared/ui/app-stat-card/app-stat-card.component';
import { AppAvatarComponent } from '../../../../shared/ui/app-avatar/app-avatar.component';
import { E } from '@angular/cdk/keycodes';

export interface CoupleMood {
  value: string,
  emoji: string;
  label: string;
  color: string;
}
export interface DaiylyMood {
  mood: string;
  note: string;
  logDate: string;
  userId: string;
  userName: string;
}
export interface LoveNote {
  id: string;
  author: string;
  content: string;
  time: string;
  color: string;
}
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
  private DashBoardServiceService = inject(DashBoardServiceService);
  listAblum: any =[];
  listEventUpcomming: any = [];
  currentUser = signal<UserInfo | undefined>(undefined);
  partner = signal<UserInfo | undefined>(undefined);

  userName = computed(() => this.currentUser()?.fullName || 'Alex');
  userAvatar = computed(() => this.currentUser()?.avatarUrl || null);

  partnerName = computed(() => this.partner()?.fullName || 'Sophia Miller');
  partnerAvatar = computed(() => this.partner()?.avatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80');

  daysTogether = signal<number>(520);
  memoriesCount = signal<number>(148);
  upcomingEventsCount = signal<number>(3);
  chatMessagesCount = signal<number>(1240);
  // cham ngon couple
  textCouple = signal<string>('cham ngon');

  // Live Anniversary Countdown Signals
  countdownDays = signal<number>(14);
  countdownHours = signal<number>(8);
  countdownMins = signal<number>(32);
  countdownSecs = signal<number>(45);

  private timerInterval: any;

  // Interactive Mood Selector State
  moodOptions: CoupleMood[] = [
  { value: 'LOVED', emoji: '🥰', label: 'So in Love', color: '#ff4b72' },
  { value: 'MISSED', emoji: '😘', label: 'Missing You', color: '#a855f7' },
  { value: 'NEED_HUG', emoji: '🤗', label: 'Need a Hug', color: '#ff9000' },
  { value: 'EXCITED', emoji: '🥳', label: 'Excited', color: '#10b981' },
  { value: 'RELAXED', emoji: '☕', label: 'Chill & Relax', color: '#3b82f6' }
];

  myMood = signal<CoupleMood>(this.moodOptions[0]);
  partnerMood = signal<CoupleMood>(this.moodOptions[1]);

  // Interactive Sticky Love Notes State
  loveNotes = signal<LoveNote[]>([]);
  newNoteInput = signal<string>('');

  // Virtual Hug Burst Animation State
  isBursting = signal<boolean>(false);

  ngOnInit(): void {
    this.startCountdownTimer();
    this.getAllData();
    this.getEventUpcomming();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  selectMood(mood: CoupleMood): void {
    this.myMood.set(mood);
    const currentNote = this.loveNotes().find(n => n.author === this.userName())?.content || '';
    const payload: DaiylyMood = {
      note: currentNote,
      userId: this.currentUser()?.userId || '',
      userName: this.userName() || '',
      mood: this.myMood().value,
      logDate: new Date().toISOString()
    };
    this.postNote(payload);
    this.message.success(`Đã cập nhật trạng thái cảm xúc: ${mood.emoji} ${mood.label}`);
  }

  addLoveNote(): void {
    const text = this.newNoteInput().trim();
    if (!text) return;

    const payload: DaiylyMood = {
      note: text,
      userId: this.currentUser()?.userId || '',
      userName: this.userName() || '',
      mood: this.myMood().value,
      logDate: new Date().toISOString()
    };

    this.postNote(payload);

    this.newNoteInput.set('');
  }

  deleteLoveNote(id: string): void {
    this.loveNotes.update((notes) => notes.filter((n) => n.id !== id));
  }

  triggerVirtualHug(): void {
    this.isBursting.set(true);
    this.message.success(`Đã gửi một cái ôm thật chặt và hàng ngàn trái tim tới ${this.partnerName()}! 🤗💖`);
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
  postNote(payload : DaiylyMood){
    this.DashBoardServiceService.postNoteDailyMood(payload).subscribe({
      next: (res) => {
        this.getAllData();
      },
      error: (err) => {
        this.message.error('Đã có lỗi xảy ra!');
      }
    })
  }
  getAllData(){
    forkJoin({
      coupleInfo: this.DashBoardServiceService.getInforCouple(),
      profileUser: this.DashBoardServiceService.getProfileUser(),
      moodaily: this.DashBoardServiceService.getDailyMood(),
      couple: this.DashBoardServiceService.getDashBoard(),
      album: this.DashBoardServiceService.getAblum()
    }).subscribe({
      next: (res) => {
        if (res.profileUser) {
          this.currentUser.set(res.profileUser.data);
        }
        if (res.coupleInfo) {
          this.partner.set(res.coupleInfo.data);
        }
        if (res.moodaily && res.moodaily.status === 200) {
          console.log(res.moodaily);
          const userMoodData = res.moodaily.data?.userMood;
          const partnerMoodData = res.moodaily.data?.partnerMood;

          const userMoodValue = userMoodData?.mood;
          const partnerMoodValue = partnerMoodData?.mood;
          if (userMoodValue) {
            const emoteUser = this.moodOptions.find((item) => item.value === userMoodValue);
            if (emoteUser) {
              this.myMood.set(emoteUser);
            }
          }
          if (partnerMoodValue) {
            const emotePartner = this.moodOptions.find((item) => item.value === partnerMoodValue);
            if (emotePartner) {
              this.partnerMood.set(emotePartner);
            }
          }
          const mappedNotes: LoveNote[] = [];
          if (userMoodData?.note) {
            mappedNotes.push({
              id: userMoodData.dailyMoodId,
              author: userMoodData.userName,
              content: userMoodData.note,
              time: this.formatDate(userMoodData.logDate),
              color: '#fff3c4'
            });
          }
          if (partnerMoodData?.note) {
            mappedNotes.push({
              id: partnerMoodData.dailyMoodId,
              author: partnerMoodData.userName,
              content: partnerMoodData.note,
              time: this.formatDate(partnerMoodData.logDate),
              color: '#ffd0e0'
            });
          }
          
          if (mappedNotes.length > 0) {
            this.loveNotes.set(mappedNotes);
          }
        }
        if (res.couple && res.couple.status === 200) {
          const startDate = new Date(res.couple.data.couple.relationshipStartDate);
          this.memoriesCount.set(res.couple.data.shareMemory);
          this.upcomingEventsCount.set(res.couple.data.upcommingDate);
          this.chatMessagesCount.set(res.couple.data.totalMessage);
          this.textCouple.set(res.couple.data.couple.loveMotto);
          const today = new Date();
          const diffDays = Math.floor(
            (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          this.daysTogether.set(diffDays);
        }
        if(res.album && res.album.status === 200){
          this.listAblum = res.album.data;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  getEventUpcomming(){
    this.DashBoardServiceService.getEventUpcomming().subscribe({
      next: (res) => {
        if (res && res.status === 200) {
          this.listEventUpcomming = res.data;
        }
      },
      error: (err) => {
        console.error(err);
    }})
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
    }
  formatDateEvent(dateString: string): string {
    const now =  new  Date();
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }

}
