import { Component, inject } from '@angular/core';
import { ThemeMode, ThemeService } from '../../../services/theme.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';

@Component({
  selector: 'app-theme-selector',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatTooltip, MatDivider],
  templateUrl: './theme-selector.html',
  styleUrl: './theme-selector.scss',
})
export class ThemeSelector {
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
