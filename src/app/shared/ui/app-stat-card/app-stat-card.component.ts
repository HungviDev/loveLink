import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './app-stat-card.component.html',
  styleUrl: './app-stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppStatCardComponent {
  title = input.required<string>();
  value = input.required<string | number>();
  icon = input<string>('heart');
  color = input<string>('#ff4b72');
  unit = input<string | null>(null);
}
