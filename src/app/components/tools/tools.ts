import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from "@angular/material/divider";
import { ThemeMode, ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tools',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    MatMenuModule,
    MatBadgeModule,
    MatDivider,
  ],
  templateUrl: './tools.html',
  styleUrl: './tools.scss',
})
export class Tools {
  protected readonly themeService = inject(ThemeService);

  // Curated professional M3 palettes
  protected readonly presets = [
    '#6750A4', // Deep Purple (Default M3)
    '#006A6A', // Teal
    '#984061', // Rose
    '#445E91', // Blue
    '#606200', // Olive
  ];

  setTheme(mode: ThemeMode) {
    this.themeService.mode.set(mode);
  }

  setCustomColor(color: string) {
    this.themeService.customColor.set(color);
    this.themeService.mode.set('custom');
  }
}
