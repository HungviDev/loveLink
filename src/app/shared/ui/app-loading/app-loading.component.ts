import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, NzSpinModule],
  templateUrl: './app-loading.component.html',
  styleUrl: './app-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLoadingComponent {
  tip = input<string>('Loading love memories...');
  size = input<'small' | 'default' | 'large'>('large');
}
