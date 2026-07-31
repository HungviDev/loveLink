import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, NzPageHeaderModule, NzIconModule],
  templateUrl: './app-page-header.component.html',
  styleUrl: './app-page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string | undefined>(undefined);
  backIcon = input<boolean>(false);

  back = output<void>();

  onBack(): void {
    this.back.emit();
  }
}
