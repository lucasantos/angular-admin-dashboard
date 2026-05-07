import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { Breadcrumb } from '../../components/breadcrumb/breadcrumb';
import { CustomSidenav } from '../../components/custom-sidenav/custom-sidenav';
import { Search } from '../../components/search/search';
import { Tools } from '../../components/tools/tools';
import { menuItems } from '../../menu-items';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  protected readonly authService = inject(AuthService);
  protected readonly title = signal('Dashboard');
  protected readonly logo = 'icons/icon-72x72.png';

  // Injecting it here initializes the theme from localStorage immediately
  private readonly themeService = inject(ThemeService);

  collapsed = signal(false);

  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));

  // Centralized menu items from single source of truth
  protected readonly menuItems = menuItems;
}
