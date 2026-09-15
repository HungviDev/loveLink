import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { CoupleServiceService } from '../../coupleService.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-pairing-invitations',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzTypographyModule,
    NzGridModule,
    NzAvatarModule
  ],
  templateUrl: './pairing-invitations.html',
  styleUrl: './pairing-invitations.scss'
})
export class PairingInvitations implements OnInit {
  private coupleService = inject(CoupleServiceService);
  private message = inject(NzMessageService);
  private authService = inject(AuthService);
  idUser = signal<any>(null);
  // Fake Data dựa theo ảnh
  mockInvitations = signal<any[]>([]);
  mockSuggestions = signal<any[]>([]);
  constructor() {
    let user = this.authService.getUser();
    this.idUser.set(user.userinfo.userId);
   }

  ngOnInit(): void {
    this.getListSuggestion();
    this.getListUser();
  }

  acceptInvitation(item: any): void {
    const payload = {
      pairCode: item.pairCode,
      receiverId: this.idUser()
    }
    this.coupleService.postCouple(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.message.success('Đã gửi lời mời ghép đôi');
        item.isSent = true;
      },
      error: (err) => {
        this.message.error(err.error.message);
      }
    })
  }

  revokeInvitation(item: any): void {
    // TODO: Gọi API thu hồi lời mời
    item.isSent = false;
    this.message.success('Đã thu hồi lời mời ghép đôi');
  }

  rejectInvitationUser(item: any): void {
    const param = {
      status : 'REJECTED',
      idInvitation: item.idInvitation
    }
    this.coupleService.updateStatusInvitation(param).subscribe({
      next: (res) => {
        if(res.status === 200){
          this.message.success('Từ chối lời mời ghép đôi thành công!');
          this.getListSuggestion();
        }
      },
      error: (err) => {
        this.message.error("Kết bạn thất bại");
      }
    })
  }
  getListUser(){
    const param = {
    }
    
    this.coupleService.getUserSingle(param).subscribe({
      next: (res) => {
        this.mockInvitations.set(res.data)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  getListSuggestion(){
    const param = {
    }
    this.coupleService.getAllInvatation(param).subscribe({
      next: (res) => {
        this.mockSuggestions.set(res.data)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  calculateAge(date: string){
    const dateAge = new Date(date);
    return new Date().getFullYear() - dateAge.getFullYear();
  }
  acceptInvitationUser(item: any){
    console.log(item);
    const param = {
      status : 'ACCEPTED',
      idInvitation: item.idInvitation
    }
    this.coupleService.updateStatusInvitation(param).subscribe({
      next: (res) => {
        if(res.status === 200){
          this.message.success("Kết bạn thành công");
          this.getListSuggestion();
        }
      },
      error: (err) => {
        this.message.error("Kết bạn thất bại");
      }
    })
  }
  rejectInvitation(item: any){

  }
}
