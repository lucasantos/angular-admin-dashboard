import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from "@angular/material/divider";
import { ThemeMode, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-tools',
  imports: [MatButtonModule, MatIconModule, MatTooltip, MatMenuModule, MatBadgeModule, MatDivider],
  templateUrl: './tools.html',
  styleUrl: './tools.scss',
})
export class Tools {
  protected readonly themeService = inject(ThemeService);

  setTheme(mode: ThemeMode) {
    this.themeService.mode.set(mode);
  }
}
