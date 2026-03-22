import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MenuItems } from '../../models/menu-item';
import { MenuItem } from "../menu-item/menu-item";

@Component({
  selector: 'app-custom-sidenav',
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MatTooltipModule, MenuItem],
  templateUrl: './custom-sidenav.html',
  styleUrl: './custom-sidenav.scss',
})
export class CustomSidenav {
  sideNavCollapsed = signal(false);
  @Input() set collapsed(value: boolean) {
    this.sideNavCollapsed.set(value);
  }

  protected readonly menuItems = signal<MenuItems[]>([
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    {
      label: 'Content', icon: 'video_library', route: '/content',
      subItems: [
        { label: 'Articles', icon: 'article', route: '/articles',
          subItems: [
            { label: 'Tech', icon: 'memory', route: '/tech' },
            { label: 'Health', icon: 'health_and_safety', route: '/health' },
            { label: 'Travel', icon: 'flight_takeoff', route: '/travel' },
          ]
        },
        { label: 'Videos', icon: 'videocam', route: '/videos' },
        { label: 'Podcasts', icon: 'podcasts', route: '/podcasts' },
        { label: 'Images', icon: 'image', route: '/images' },
        { label: 'Documents', icon: 'description', route: '/documents' },
      ]
    },
    { label: 'Analytics', icon: 'analytics', route: '/analytics' },
    { label: 'Comments', icon: 'comment', route: '/comments' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
    { label: 'Feedback', icon: 'feedback', route: '/feedback' },
    { label: 'Logout', icon: 'logout', class: 'logout', route: '/logout' },
  ]);

  profilePicSize = computed(() => (this.sideNavCollapsed() ? '50' : '100'));
}
