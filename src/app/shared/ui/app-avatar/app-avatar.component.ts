import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, NzAvatarModule, NzBadgeModule],
  templateUrl: './app-avatar.component.html',
  styleUrl: './app-avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppAvatarComponent {
  src = input<string | null>(null);
  name = input<string>('User');
  size = input<number | 'large' | 'small' | 'default'>('default');
  status = input<'success' | 'processing' | 'default' | 'error' | 'warning' | null>(null);
}
