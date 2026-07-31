import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [CommonModule, NzEmptyModule],
  templateUrl: './app-empty.component.html',
  styleUrl: './app-empty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppEmptyComponent {
  description = input<string>('No items found');
}
