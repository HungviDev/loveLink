import { Component, ChangeDetectionStrategy, signal, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../../../../core/services/auth.service';

export type PairingStep = 'intro' | 'code' | 'success';

@Component({
  selector: 'app-couple-pairing-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzIconModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './couple-pairing-modal.component.html',
  styleUrl: './couple-pairing-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CouplePairingModalComponent {
  private authService = inject(AuthService);
  private message = inject(NzMessageService);

  pairedSuccess = output<void>();

  isVisible = signal<boolean>(true);
  currentStep = signal<PairingStep>('intro');
  pairCodeInput = signal<string>('');
  isVerifying = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  myPairCode = this.authService.myPairCode;
  partnerName = 'Sophia Miller';

  nextStep(): void {
    if (this.currentStep() === 'intro') {
      this.currentStep.set('code');
    }
  }

  useSampleCode(): void {
    this.pairCodeInput.set('LOVE68');
  }

  copyMyCode(): void {
    navigator.clipboard.writeText(this.myPairCode());
    this.message.success('Đã sao chép mã của bạn vào bộ nhớ tạm! 💕');
  }

  verifyCode(): void {
    const code = this.pairCodeInput();
    if (!code || code.trim().length === 0) {
      this.errorMessage.set('Vui lòng nhập mã kết nối của người ấy!');
      return;
    }

    this.isVerifying.set(true);
    this.errorMessage.set(null);

    this.authService.verifyPairCode(code).subscribe({
      next: () => {
        this.isVerifying.set(false);
        this.currentStep.set('success');
      },
      error: (err) => {
        this.isVerifying.set(false);
        this.errorMessage.set(err.message || 'Mã kết nối không hợp lệ');
      }
    });
  }

  completePairing(): void {
    this.isVisible.set(false);
    this.pairedSuccess.emit();
  }
}
