import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { Breadcrumb } from '../../../shared/components/breadcrumb/breadcrumb';
import { CustomSidenav } from '../../../shared/components/custom-sidenav/custom-sidenav';
import { Search } from '../../../shared/components/search/search';
import { Tools } from '../tools/tools';
import { menuItems } from '../../navigation/menu-items';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../../services/loading.service';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    CustomSidenav,
    RouterLinkWithHref,
    MatTooltip,
    Search,
    Tools,
    Breadcrumb,
    MatProgressBarModule,
    TranslocoDirective,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  protected readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);
  protected readonly title = signal('Dashboard');
  protected readonly logo = 'icons/icon-72x72.png';

  // Injecting it here initializes the theme from localStorage immediately
  private readonly themeService = inject(ThemeService);

  collapsed = signal(false);

  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));

  // Centralized menu items from single source of truth
  protected readonly menuItems = menuItems;

  // Show progress bar if not authenticated (initial load) or if any HTTP request is in progress
  protected readonly showProgressBar = computed(
    () => !this.authService.isAuthenticated() || this.loadingService.isLoading(),
  );
}
