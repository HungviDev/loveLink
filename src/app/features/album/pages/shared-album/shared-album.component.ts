import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';

export interface PhotoItem {
  id: string;
  title: string;
  url: string;
  albumCategory: string;
  date: string;
  likes: number;
}

@Component({
  selector: 'app-shared-album',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzTagModule,
    NzModalModule
  ],
  templateUrl: './shared-album.component.html',
  styleUrl: './shared-album.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedAlbumComponent {
  selectedCategory = signal<string>('all');
  selectedPhoto = signal<PhotoItem | null>(null);

  photos = signal<PhotoItem[]>([
    {
      id: '1',
      title: 'Kỷ niệm Paris dưới tuyết ❄️',
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      albumCategory: 'travel',
      date: 'Feb 2024',
      likes: 12
    },
    {
      id: '2',
      title: 'Bữa tối nến lãng mạn 🍷',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      albumCategory: 'dates',
      date: 'Dec 2023',
      likes: 8
    },
    {
      id: '3',
      title: 'Bình minh biển Bali 🌅',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      albumCategory: 'travel',
      date: 'Nov 2024',
      likes: 15
    },
    {
      id: '4',
      title: 'Góc sân thượng căn hộ mới 🌿',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      albumCategory: 'daily',
      date: 'Jun 2024',
      likes: 6
    }
  ]);

  categories = [
    { key: 'all', label: 'Tất Cả Khoảnh Khắc ✨' },
    { key: 'travel', label: 'Chuyến Đi Du Lịch ✈️' },
    { key: 'dates', label: 'Buổi Hò Hẹn 🍷' },
    { key: 'daily', label: 'Cuộc Sống Thường Ngày ☕' }
  ];

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  openPreview(photo: PhotoItem): void {
    this.selectedPhoto.set(photo);
  }

  closePreview(): void {
    this.selectedPhoto.set(null);
  }

  likePhoto(photo: PhotoItem, event: MouseEvent): void {
    event.stopPropagation();
    this.photos.update((items) =>
      items.map((p) => (p.id === photo.id ? { ...p, likes: p.likes + 1 } : p))
    );
  }
}
