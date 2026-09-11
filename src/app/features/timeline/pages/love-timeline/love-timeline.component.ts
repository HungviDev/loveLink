import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
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
import { AuthService } from '../../../../core/services/auth.service';
import { TimeLineService } from '../../Services/timeLine.service';
import { finalize } from 'rxjs';

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

import { NzModalService } from 'ng-zorro-antd/modal';

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
export class LoveTimelineComponent implements OnInit {
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);
  private fileUploadService = inject(FileUploadService);
  public authService = inject(AuthService);
  private TimeLineService = inject(TimeLineService);
  private modalService = inject(NzModalService);
  listEvent = signal<any[]>([]);
  user = signal<any>(null);
  status = signal<string>('');
  isModalVisible = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isUploading = signal<boolean>(false); 
  itemSelected = signal<any>(null);
  memoryForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    milestoneDate: [null, [Validators.required]],
    description: ['', [Validators.required]],
    location: ['', [Validators.required]],
    imageUrl: [''],
    category: ['']
  });

  ngOnInit(): void {
    const userInfo: any = this.authService['getUser']();
    if (userInfo && userInfo.userinfo) {
      this.user.set(userInfo.userinfo.userId);
      this.getAllTimeLineEvent(this.user());
    }
  }
  openAddModal(): void {
    this.status.set('create');
    this.memoryForm.reset({
      title: '',
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
          this.memoryForm.patchValue({ imageUrl: uploadedUrl });
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
    this.memoryForm.patchValue({ imageUrl: '' });
  }

  submitMemory(): void {
    this.isSaving.set(true);
    if (this.memoryForm.invalid) {
      Object.values(this.memoryForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.isSaving.set(false);
    let payload = this.memoryForm.value;
    payload = {
      ...payload,
      idUser: this.user(),
      milestoneDate: new Date(payload.milestoneDate).toISOString().split('T')[0],
    }
    if(this.status() === 'edit'){
      payload = {
        ...payload,
        idTimeLine: this.itemSelected().timelineId
      }
      console.log(payload);
      this.putTimeLine(payload);
    }
    else{
      if (payload.idTimeLine) {
        delete payload.idTimeLine;
      }
      this.postTimeLine(payload);
    }
  }
  getAllTimeLineEvent(id: string,params?: any){
    this.TimeLineService.getTimeLineById(id,params).subscribe({
      next: (res) => {
        if(res.status === 200){
          this.listEvent.set(res.data);
        }
      },
      error: (err) =>{
        console.log(err);
      }
    })
  }
  formatDate(date: string | Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  postTimeLine(payload: any){
    this.TimeLineService.postTimeLine(payload).pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: (res) => {
        if(res.data === true){
          this.message.success("Thêm dòng thời gian thành công");
          this.getAllTimeLineEvent(this.user());
          this.isModalVisible.set(false);
        }
      },
        error: (err) => {
        this.message.error("Thêm dòng thời gian thất bại");
        console.log(err);
        }
    })
  }
  putTimeLine(payload: any){
    this.TimeLineService.putTimeLine(payload).pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: (res) => {
        if(res.data === true){
          this.message.success("Cập nhật dòng thời gian thành công");
          this.getAllTimeLineEvent(this.user());
          this.isModalVisible.set(false);
        }
      },
        error: (err) => {
        this.message.error("Cập nhật dòng thời gian thất bại");
        console.log(err);
        }
    })
  }
  editForm(item: any){
    this.itemSelected.set(item);
    this.status.set('edit');
    this.memoryForm.reset();
    this.isModalVisible.set(true);
    this.memoryForm.patchValue(item);
  }
  deleteItem(item: any){
    this.modalService.confirm({
      nzTitle: 'Xác nhận xóa cột mốc này?',
      nzContent: `Bạn có chắc chắn muốn xóa kỷ niệm <b>"${item.title}"</b> không? Hành động này không thể hoàn tác.`,
      nzOkText: 'Xóa kỷ niệm',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Hủy bỏ',
      nzOnOk: () => {
        this.TimeLineService.deleteTimeLine(item.timelineId).subscribe({
          next: (res) => {
            if(res.data === true){
              this.message.success("Xóa thành công");
              this.getAllTimeLineEvent(this.user());
            }
          },
          error:(err) =>{
            this.message.error("Xóa thất bại");
            console.log(err);
          }
        })
      }
    });
  }
  

  
}

