import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule],
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppButtonComponent {
  type = input<'primary' | 'default' | 'dashed' | 'text' | 'link'>('primary');
  danger = input<boolean>(false);
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  icon = input<string | null>(null);
  block = input<boolean>(false);
  size = input<'large' | 'default' | 'small'>('default');

  btnClick = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.btnClick.emit(event);
    }
  }
}
