import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { CoupleServiceService } from '../../coupleService.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
export interface Paging {
  page: number;
  pageSize: number;
  total: number;
}
@Component({
  selector: 'app-pairing-invitations',
  imports: [
    CommonModule,
    NzListModule,
    NzAvatarModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzTypographyModule,
    NzPaginationModule
  ],
  templateUrl: './pairing-invitations.html',
  styleUrl: './pairing-invitations.scss'
})
export class PairingInvitations implements OnInit {
  private coupleService = inject(CoupleServiceService);
  private message = inject(NzMessageService);
  listInvitations = signal<any[]>([]);
  paging = signal<Paging>({
    page: 0,
    pageSize: 10,
    total: 0
  })

  constructor() { }

  ngOnInit(): void {
    this.getAllCoupleInvitations(this.paging());
  }
  acceptInvitation(id: string): void {
    this.updateStatus(id,'ACCEPTED');
    this.coupleService.setValue(false);
  }
  rejectInvitation(id: string): void {
    this.updateStatus(id,'REJECTED');
  }
  formatDate(date: string): string {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes()} - ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }
  getAllCoupleInvitations(paging: Paging){
    let param  = {
      page: paging.page,
      size: paging.pageSize
    };
    this.coupleService.getAllInvatation(param).subscribe({
      next: (data) => {
        if(data){
          this.listInvitations.set(data.data);
          this.paging().total = data.meta.totalElements;
        }
      },
      error: (error) => {
        this.message.error('Không thể tải được danh sách lời mời');
        console.log(error);
      }
    })
  }
  onPageIndexChange(event: any){
    this.paging().page = event;
    this.getAllCoupleInvitations(this.paging());
  }
  updateStatus(idInvitation: string, status: string){
    const payload = {
      status: status,
      IdInvitation: idInvitation
    }
    this.coupleService.updateStatusInvitation(payload).subscribe({
      next: (data) => {
        if(data){
          this.message.success('Cập nhật thành công');
          this.getAllCoupleInvitations(this.paging());
        }
      },
      error: (error) => {
        this.message.error('Không thể cập nhật được trạng thái');
        console.log(error);
      }
    })
  }
}
