import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

export type MenuItem = {
    label: string;
    icon: string;
    route: string | null;
};

@Component({
  selector: 'app-custom-sidenav',
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MatTooltipModule],
  templateUrl: './custom-sidenav.html',
  styleUrl: './custom-sidenav.scss',
})
export class CustomSidenav {
  sideNavCollapsed = signal(false);
  @Input() set collapsed(value: boolean) {
    this.sideNavCollapsed.set(value);
  }

  protected readonly menuItems = signal<MenuItem[]>([
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Content', icon: 'video_library', route: '/content' },
    { label: 'Analytics', icon: 'analytics', route: '/analytics' },
    { label: 'Comments', icon: 'comment', route: '/comments' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
    { label: 'Feedback', icon: 'feedback', route: '/feedback' },
    { label: 'Logout', icon: 'logout', route: '/logout' },
  ]);

  profilePicSize = computed(() => (this.sideNavCollapsed() ? '50' : '100'));
}
