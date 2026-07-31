import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, NzModalModule],
  templateUrl: './app-confirm-dialog.component.html',
  styleUrl: './app-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppConfirmDialogComponent {
  isVisible = input<boolean>(false);
  title = input<string>('Are you sure?');
  content = input<string>('This action cannot be undone.');
  okText = input<string>('Confirm');
  cancelText = input<string>('Cancel');
  loading = input<boolean>(false);

  confirm = output<void>();
  cancel = output<void>();

  handleOk(): void {
    this.confirm.emit();
  }

  handleCancel(): void {
    this.cancel.emit();
  }
}
