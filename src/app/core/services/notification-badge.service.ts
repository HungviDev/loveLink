import { Injectable, signal, computed } from '@angular/core';

export type MenuBadgeKey = 'dashboard' | 'couple' | 'timeline' | 'album' | 'chat' | 'todo' | 'calendar' | 'invitations';

export interface MenuBadgeState {
  dashboard: number;
  couple: number;
  timeline: number;
  album: number;
  chat: number;
  todo: number;
  calendar: number;
  invitations: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationBadgeService {
  private badgeState = signal<MenuBadgeState>({
    dashboard: 0,
    couple: 0,
    timeline: 2,
    album: 5,
    chat: 3,
    todo: 4,
    calendar: 1,
    invitations: 2
  });

  readonly badges = this.badgeState.asReadonly();

  readonly totalCount = computed(() => {
    const s = this.badgeState();
    return Object.values(s).reduce((acc, count) => acc + count, 0);
  });

  getBadgeCount(key: MenuBadgeKey): number {
    return this.badgeState()[key] || 0;
  }

  clearBadge(key: MenuBadgeKey): void {
    if (this.badgeState()[key] === 0) return;
    this.badgeState.update((state) => ({
      ...state,
      [key]: 0
    }));
  }

  setBadge(key: MenuBadgeKey, count: number): void {
    this.badgeState.update((state) => ({
      ...state,
      [key]: Math.max(0, count)
    }));
  }

  incrementBadge(key: MenuBadgeKey, delta: number = 1): void {
    this.badgeState.update((state) => ({
      ...state,
      [key]: (state[key] || 0) + delta
    }));
  }

  resetAll(): void {
    this.badgeState.set({
      dashboard: 0,
      couple: 0,
      timeline: 0,
      album: 0,
      chat: 0,
      todo: 0,
      calendar: 0,
      invitations: 0
    });
  }

  // Helper method to add random new item for testing live updates
  simulateNewUpdate(): void {
    const keys: MenuBadgeKey[] = ['timeline', 'album', 'chat', 'todo', 'calendar', 'invitations'];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    this.incrementBadge(randomKey, 1);
  }
}
