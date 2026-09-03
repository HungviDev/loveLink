import { CacheServiceService } from './../../core/services/CacheService.service';
import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { ThemeService, ThemeMode } from '../../core/services/theme.service';
import { NotificationBadgeService } from '../../core/services/notification-badge.service';
import { AppAvatarComponent } from '../../shared/ui/app-avatar/app-avatar.component';
import { CouplePairingModalComponent } from '../../features/couple/components/couple-pairing-modal/couple-pairing-modal.component';
import { CoupleAiAssistantComponent } from '../../shared/ui/couple-ai-assistant/couple-ai-assistant.component';
import { AuthKeys } from '../../core/models/auth-keys.model';
import { UserProfileServiceService } from '../UserProfileService.service';
import { CoupleServiceService } from '../../features/couple/coupleService.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzDropDownModule,
    NzAvatarModule,
    NzTooltipModule,
    NzBadgeModule,
    NzButtonModule,
    AppAvatarComponent,
    CouplePairingModalComponent,
    CoupleAiAssistantComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent implements OnInit{
  private authService = inject(AuthService);
  public themeService = inject(ThemeService);
  public CacheServiceService = inject(CacheServiceService);
  public badgeService = inject(NotificationBadgeService);
  private UserProfileServiceService = inject(UserProfileServiceService);
  private CoupleServiceService = inject(CoupleServiceService);
  private router = inject(Router);
  //info user
  userProfile =signal<any>(null);
  
  isCollapsed = signal<boolean>(false);
  activeTheme = this.themeService.activeTheme;
  isPaired = this.authService.isPaired;

  showPairingModal = signal<boolean>(false);
  userId: string ='';
  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects || event.url;
        this.clearBadgeForUrl(url);
      });
  }
  ngOnInit(): void {
    this.checkUserIdCouple();
    this.getProfile();
  }

  clearBadgeForUrl(url: string): void {
    if (url.includes('/dashboard')) this.badgeService.clearBadge('dashboard');
    else if (url.includes('/couple')) this.badgeService.clearBadge('couple');
    else if (url.includes('/timeline')) this.badgeService.clearBadge('timeline');
    else if (url.includes('/album')) this.badgeService.clearBadge('album');
    else if (url.includes('/chat')) this.badgeService.clearBadge('chat');
    else if (url.includes('/todo')) this.badgeService.clearBadge('todo');
    else if (url.includes('/calendar')) this.badgeService.clearBadge('calendar');
    else if (url.includes('/invitaion')) this.badgeService.clearBadge('invitations');
  }

  toggleCollapsed(): void {
    this.isCollapsed.update((v) => !v);
  }

  selectTheme(themeId: ThemeMode): void {
    this.themeService.setTheme(themeId);
  }

  openPairingModal(): void {
    this.showPairingModal.set(true);
  }

  onPairingSuccess(): void {
    this.showPairingModal.set(false);
  }

  logout(): void {
    this.CacheServiceService.removeCache(AuthKeys.TOKEN);
    this.router.navigate(['/auth/login']);
  }

  simulateNewUpdate(): void {
    this.badgeService.simulateNewUpdate();
  }

  clearAllBadges(): void {
    this.badgeService.resetAll();
  }
   checkUserIdCouple() {
  this.UserProfileServiceService.getPartnerProfile().subscribe({
    next: (res) => {
      if(res.status === 200) {
        this.showPairingModal.set(false);
      }
    },
    error: (err) => {
      console.log(err);
      if (err.status === 404 && err.error?.data === 'UsernotFoundCouple') {
         this.showPairingModal.set(true);
      } else {
         this.showPairingModal.set(false);
      }
    }
  });
}
  getProfile(){
    this.UserProfileServiceService.getUserProfile().subscribe({
      next: (res) => {
        if(res.status === 200) {
          this.userProfile.set(res.data);
        }
      },
      error: (err) => {
        console.log(err);
    }})
  }
 
}

