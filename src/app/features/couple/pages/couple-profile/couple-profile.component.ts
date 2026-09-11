import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../../../../core/services/auth.service';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppAvatarComponent } from '../../../../shared/ui/app-avatar/app-avatar.component';
import { DashBoardServiceService } from '../../../dashboard/DashBoardService.service';
import { CoupleServiceService } from '../../coupleService.service';
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
export interface Couple {
  coupleId: string;
  loveMotto: string;
  coverImageUrl: string | null;
  relationshipStartDate: string;
  status: string;
  createdAt: string;
}
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
export class CoupleProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private message = inject(NzMessageService);
  private DashBoardServiceService = inject(DashBoardServiceService);
  private coupleService = inject(CoupleServiceService);
  listEventUpcomming: any[] = [];
  ngOnInit(): void {
    this.getCoupleInfo();
    this.getProfile();
    this.getInfoCoupleDashBoard();
    this.getEventUpcomming();
  }
  currentUser = signal<UserInfo | undefined>(undefined);
  partnerUser = signal<UserInfo | undefined>(undefined);
  couple = signal<Couple | undefined>(undefined);

  relationshipStatus = signal<string>('Connected & In Love 💕');
  l = signal<string>('February 14, 2023');
  loveMotto = signal<string>('');

  together = computed(() => this.dayTogether(this.couple()?.relationshipStartDate  || 'null'));
  userBio = computed(() => this.currentUser()?.bio || 'null');
  
  partnerBio = computed(() => this.partnerUser()?.bio || 'null');

  userTags = signal<string[]>(['Travel Lover ✈️', 'Coffee Addict ☕', 'Movie Fan 🎬']);
  partnerTags = signal<string[]>(['Photography 📷', 'Baking 🥐', 'Romantic Heart 💖']);

  partnerName = computed(() => this.partnerUser()?.fullName);
  partnerAvatar = computed(() => this.partnerUser()?.avatarUrl);

  saveLoveMotto(): void {
    let payload = {
      loveMotto: this.loveMotto(),
    }
    this.coupleService.updateCouple(payload).subscribe({
      next: (res) => {
        if(res.status === 200){
          this.message.success('Đã lưu châm ngôn tình yêu thành công! 💕');
        }
      },
      error: (err) => {
        this.message.error('Lỗi! Không thể lưu châm ngôn tình yêu!');
      }
    })
  }
  getProfile(){
    this.DashBoardServiceService.getProfileUser().subscribe({
      next: (res) => {
        if(res.status === 200){
          this.currentUser.set(res.data);
        }
      }
     })
  }
  getCoupleInfo(){
    this.DashBoardServiceService.getInforCouple().subscribe({
      next: (res) => {
        if(res.status === 200){
          this.partnerUser.set(res.data);
        }
      }
    })
  }
  getInfoCoupleDashBoard(){
    this.DashBoardServiceService.getDashBoard().subscribe({
      next: (res) => {
        if(res.status === 200){
          this.couple.set(res.data.couple);
          this.loveMotto.set(this.couple()?.loveMotto || '');
        }
      }
    })
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
  dayTogether(date: string){
    const date1 = new Date(date);
    const today = new Date();
    const diffDays = Math.floor(
      (today.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays;
  }
  tranferGender(gender: any){
    if(gender === 1){
      return 'Nam';
    }else{
      return 'Nữ';
    }
  }
  tranferPatnerGender(gender: any){
    if(gender === 1){
      return 'Nữ';
    }else{
      return 'Nam';
    }
  }

  

  

}
