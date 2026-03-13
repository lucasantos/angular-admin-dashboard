import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from "@angular/material/list";
import { RouterModule } from '@angular/router';

export type MenuItem = {
    label: string;
    icon: string;
    route: string;
};

@Component({
  selector: 'app-custom-sidenav',
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './custom-sidenav.html',
  styleUrl: './custom-sidenav.scss',
})
export class CustomSidenav {
  protected readonly menuItems = signal<MenuItem[]>([
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Content', icon: 'video_library', route: '/content' },
    { label: 'Analytics', icon: 'analytics', route: '/analytics' },
    { label: 'Comments', icon: 'comment', route: '/comments' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ]);
}
