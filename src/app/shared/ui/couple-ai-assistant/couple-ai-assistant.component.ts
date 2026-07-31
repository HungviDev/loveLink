import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

@Component({
  selector: 'app-couple-ai-assistant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CdkDrag,
    NzIconModule,
    NzTooltipModule
  ],
  templateUrl: './couple-ai-assistant.component.html',
  styleUrl: './couple-ai-assistant.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoupleAiAssistantComponent {
  isOpen = signal<boolean>(false);
  isTyping = signal<boolean>(false);
  userMessageInput = signal<string>('');

  messages = signal<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Xin chào hai bạn! Mình là Cupid AI 💖 — Trợ lý tư vấn cảm xúc & tình yêu. Hôm nay bạn cần gợi ý hò hẹn, lời khuyên tình cảm hay bất cứ điều gì ngọt ngào không?',
      timestamp: this.getCurrentTime()
    }
  ]);

  quickPrompts = [
    '💡 Ý tưởng hò hẹn cuối tuần?',
    '💕 Làm sao để làm lành khi giận?',
    '💌 Lời chúc ngọt ngào hôm nay?',
    '🎁 Gợi ý quà kỷ niệm ý nghĩa?'
  ];

  toggleChat(): void {
    this.isOpen.update((v) => !v);
  }

  closeChat(): void {
    this.isOpen.set(false);
  }

  sendQuickPrompt(promptText: string): void {
    this.userMessageInput.set(promptText);
    this.sendMessage();
  }

  sendMessage(): void {
    const text = this.userMessageInput().trim();
    if (!text || this.isTyping()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: this.getCurrentTime()
    };

    this.messages.update((msgs) => [...msgs, userMsg]);
    this.userMessageInput.set('');
    this.isTyping.set(true);

    // Simulate AI thinking & response
    setTimeout(() => {
      const aiResponseText = this.generateAiResponse(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: this.getCurrentTime()
      };

      this.messages.update((msgs) => [...msgs, aiMsg]);
      this.isTyping.set(false);
    }, 1200);
  }

  private generateAiResponse(input: string): string {
    const lower = input.toLowerCase();

    if (lower.includes('hò hẹn') || lower.includes('đi chơi') || lower.includes('cuối tuần')) {
      return '🌸 **Gợi ý buổi hò hẹn lãng mạn cuối tuần:**\n1. Làm một buổi Picnic nhỏ ở công viên vào hoàng hôn với dâu tây và nến.\n2. Cùng làm một món bánh ngọt hoặc bữa tối nấu ăn cùng nhau tại nhà.\n3. Đi ngắm thành phố về đêm tại một quán cafe rooftop chill nhạc jazz!';
    }

    if (lower.includes('làm lành') || lower.includes('giận') || lower.includes('cãi nhau')) {
      return '💕 **Bí quyết làm lành dịu dàng:**\n- Hãy chủ động ôm người ấy thật chặt trong 20 giây (ôm giúp giải phóng Oxytocin tình yêu).\n- Lắng nghe nhẹ nhàng và viết một tấm Note nhỏ: *"Anh/em trân trọng tình cảm của chúng mình hơn là việc ai đúng ai sai"*.\n- Mua món ăn người ấy thích nhất để tạo bất ngờ nhẹ!';
    }

    if (lower.includes('lời chúc') || lower.includes('ngọt ngào') || lower.includes('tin nhắn')) {
      return '💌 **Lời nhắn lãng mạn dành tặng người ấy:**\n"Cảm ơn em/anh vì đã xuất hiện và làm cho mỗi ngày trôi qua của anh/em đều trở nên rực rỡ và bình yên. Yêu em/anh nhiều hơn mỗi ngày! 💕"';
    }

    if (lower.includes('quà') || lower.includes('kỷ niệm')) {
      return '🎁 **Ý tưởng quà tặng kỷ niệm nhiều cảm xúc:**\n1. Cuốn album ảnh chụp khoảnh khắc tự tay hai bạn trang trí.\n2. Vòng tay đôi đúc ký tự ngày kỷ niệm đặc biệt.\n3. Một chuyến đi du lịch ngắn ngày rời xa bộn bề công việc!';
    }

    return `💖 Cupid AI luôn ở đây để lắng nghe hai bạn! Lời khuyên dành cho bạn là hãy luôn giao tiếp chân thành, dành cho đối phương những cái ôm ấm áp và trân trọng từng khoảnh khắc bên nhau nhé! ✨`;
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
