import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'rose' | 'midnight' | 'sunset' | 'aurora';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  gradient: string;
  previewColor: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'lovelink_active_theme';

  themes: ThemeOption[] = [
    {
      id: 'rose',
      name: 'Rose Romance',
      gradient: 'linear-gradient(135deg, #fff0f5 0%, #ffe4ec 35%, #ffd6e5 70%, #ffc2d1 100%)',
      previewColor: '#ff4b72',
      icon: 'heart'
    },
    {
      id: 'midnight',
      name: 'Midnight Passion',
      gradient: 'linear-gradient(135deg, #1a0b18 0%, #2d0a28 50%, #150016 100%)',
      previewColor: '#ff007f',
      icon: 'fire'
    },
    {
      id: 'sunset',
      name: 'Sunset Glow',
      gradient: 'linear-gradient(135deg, #fff3ee 0%, #ffd8cb 50%, #ffb6c1 100%)',
      previewColor: '#ff6b81',
      icon: 'smile'
    },
    {
      id: 'aurora',
      name: 'Aurora Dream',
      gradient: 'linear-gradient(135deg, #f3e8ff 0%, #ffe4e6 50%, #e0e7ff 100%)',
      previewColor: '#a855f7',
      icon: 'star'
    }
  ];

  activeTheme = signal<ThemeMode>(this.getStoredTheme());

  constructor() {
    effect(() => {
      const theme = this.activeTheme();
      localStorage.setItem(this.THEME_KEY, theme);
      this.applyThemeClass(theme);
    });
  }

  setTheme(theme: ThemeMode): void {
    this.activeTheme.set(theme);
  }

  private getStoredTheme(): ThemeMode {
    const saved = localStorage.getItem(this.THEME_KEY) as ThemeMode;
    return saved || 'rose';
  }

  private applyThemeClass(theme: ThemeMode): void {
    document.body.classList.remove('theme-rose', 'theme-midnight', 'theme-sunset', 'theme-aurora');
    document.body.classList.add(`theme-${theme}`);
  }
}
