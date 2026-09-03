import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-pairing-invitations',
  imports: [
    CommonModule,
    NzListModule,
    NzAvatarModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzTypographyModule
  ],
  templateUrl: './pairing-invitations.html',
  styleUrl: './pairing-invitations.scss'
})
export class PairingInvitations implements OnInit {

  invitations = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=A',
      time: '10 phút trước',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=B',
      time: '1 giờ trước',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=C',
      time: 'Hôm qua',
      status: 'pending'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  acceptInvitation(id: number): void {
    console.log('Chấp nhận lời mời:', id);
    // TODO: Gọi API để chấp nhận
    this.invitations = this.invitations.filter(i => i.id !== id);
  }

  rejectInvitation(id: number): void {
    console.log('Từ chối lời mời:', id);
    // TODO: Gọi API để từ chối
    this.invitations = this.invitations.filter(i => i.id !== id);
  }
}
