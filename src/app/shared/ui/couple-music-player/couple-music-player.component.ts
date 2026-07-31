import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-couple-music-player',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzTooltipModule],
  template: `
    <div class="music-player-widget" [class.is-playing]="isPlaying()">
      <div class="vinyl-disc-wrapper" (click)="togglePlay()">
        <div class="vinyl-disc" [class.spinning]="isPlaying()">
          <div class="vinyl-center">
            <span class="disc-heart">🎵</span>
          </div>
        </div>
      </div>

      <div class="music-info-group">
        <div class="song-title-row">
          <span class="song-title">Lover — Taylor Swift</span>
          <span class="music-badge">Our Song 💕</span>
        </div>
        <div class="sound-wave-bar">
          <span class="bar bar-1"></span>
          <span class="bar bar-2"></span>
          <span class="bar bar-3"></span>
          <span class="bar bar-4"></span>
          <span class="bar bar-5"></span>
        </div>
      </div>

      <button class="play-control-btn" (click)="togglePlay()" nz-tooltip [nzTooltipTitle]="isPlaying() ? 'Tạm dừng nhạc' : 'Phát nhạc lãng mạn'">
        <nz-icon [nzType]="isPlaying() ? 'pause' : 'caret-right'" nzTheme="fill" />
      </button>
    </div>
  `,
  styles: [`
    .music-player-widget {
      position: fixed;
      bottom: 24px;
      right: 28px;
      z-index: 99;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 18px 10px 12px;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 182, 193, 0.6);
      border-radius: 40px;
      box-shadow: 0 12px 36px rgba(255, 75, 114, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 44px rgba(255, 75, 114, 0.3);
      }

      .vinyl-disc-wrapper {
        cursor: pointer;

        .vinyl-disc {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle, #2a2a2a 30%, #111111 70%, #ff4b72 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: transform 0.3s ease;

          .vinyl-center {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #ff4b72;
            display: flex;
            align-items: center;
            justify-content: center;

            .disc-heart {
              font-size: 10px;
            }
          }

          &.spinning {
            animation: spinDisc 4s linear infinite;
          }
        }
      }

      .music-info-group {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .song-title-row {
          display: flex;
          align-items: center;
          gap: 8px;

          .song-title {
            font-size: 13px;
            font-weight: 800;
            color: #3d152b;
            white-space: nowrap;
          }

          .music-badge {
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 10px;
            background: rgba(255, 75, 114, 0.12);
            color: #ff4b72;
          }
        }

        .sound-wave-bar {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 12px;

          .bar {
            width: 3px;
            background: #ff4b72;
            border-radius: 2px;
            height: 4px;
            transition: height 0.2s ease;
          }
        }
      }

      &.is-playing {
        .sound-wave-bar {
          .bar-1 { animation: wave 1s infinite ease-in-out 0.1s; }
          .bar-2 { animation: wave 1s infinite ease-in-out 0.3s; }
          .bar-3 { animation: wave 1s infinite ease-in-out 0.2s; }
          .bar-4 { animation: wave 1s infinite ease-in-out 0.4s; }
          .bar-5 { animation: wave 1s infinite ease-in-out 0.15s; }
        }
      }

      .play-control-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #ff4b72 0%, #ff758c 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(255, 75, 114, 0.35);
        transition: all 0.2s ease;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    @keyframes spinDisc {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes wave {
      0%, 100% { height: 4px; }
      50% { height: 12px; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoupleMusicPlayerComponent {
  isPlaying = signal<boolean>(true);

  togglePlay(): void {
    this.isPlaying.update((v) => !v);
  }
}
