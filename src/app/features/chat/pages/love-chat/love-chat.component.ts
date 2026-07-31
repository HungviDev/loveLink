import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { AuthService } from '../../../../core/services/auth.service';
import { AppAvatarComponent } from '../../../../shared/ui/app-avatar/app-avatar.component';

export interface CoupleChatMessage {
  id: string;
  sender: 'me' | 'partner';
  text: string;
  time: string;
  sticker?: string;
}

@Component({
  selector: 'app-love-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzIconModule,
    NzTooltipModule,
    AppAvatarComponent
  ],
  templateUrl: './love-chat.component.html',
  styleUrl: './love-chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoveChatComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  chatInput = signal<string>('');

  chatMessages = signal<CoupleChatMessage[]>([
    { id: '1', sender: 'partner', text: 'Anh ơi! Tối nay 7h mình đi ăn pizza ở quán cũ nhé! 💕', time: '11:20 AM' },
    { id: '2', sender: 'me', text: 'Okie em yêu! Anh qua đón em đúng 7h nha 🚗❤️', time: '11:22 AM' },
    { id: '3', sender: 'partner', text: 'Yêu anh nhiều lắm nè! 🥰', time: '11:25 AM', sticker: '💖' }
  ]);

  quickStickers = ['🥰', '💖', '😘', '🍕', '🌸', '🤗', '✨'];

  sendMessage(): void {
    const text = this.chatInput().trim();
    if (!text) return;

    const msg: CoupleChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.chatMessages.update((msgs) => [...msgs, msg]);
    this.chatInput.set('');
  }

  sendSticker(sticker: string): void {
    const msg: CoupleChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: sticker,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sticker: sticker
    };
    this.chatMessages.update((msgs) => [...msgs, msg]);
  }
}
