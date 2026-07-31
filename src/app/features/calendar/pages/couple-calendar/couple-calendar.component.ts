import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';

export interface CalendarEvent {
  date: string;
  type: 'anniversary' | 'date' | 'birthday';
  title: string;
}

@Component({
  selector: 'app-couple-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCalendarModule,
    NzBadgeModule,
    NzTagModule,
    AppCardComponent
  ],
  templateUrl: './couple-calendar.component.html',
  styleUrl: './couple-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoupleCalendarComponent {
  selectedDate = new Date();

  upcomingEvents = signal<CalendarEvent[]>([
    { date: '14/02/2026', type: 'anniversary', title: 'Kỷ niệm 2 năm ngày bên nhau 💕' },
    { date: '20/06/2026', type: 'anniversary', title: 'Kỷ niệm 2 năm về chung mái nhà 🏠' },
    { date: '15/08/2026', type: 'birthday', title: 'Sinh nhật Sophia 🎂' },
    { date: '08/11/2026', type: 'date', title: 'Kỷ niệm chuyến đi Bali ✈️' }
  ]);
}
