import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SettingsService } from '../../../../settings/services/settings.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../../../core/services/theme.service';
import { LanguageService } from '../../../../../core/services/language.service';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslocoDirective,
    TranslocoPipe
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private readonly fb = inject<FormBuilder>(FormBuilder);
  protected themeService = inject<ThemeService>(ThemeService);
  protected languageService = inject<LanguageService>(LanguageService);
  protected settingsService = inject<SettingsService>(SettingsService);

  // Presets for theme colors (could be expanded to include more options or user-defined colors)
  protected readonly presets = ['#6750A4', '#006A6A', '#984061', '#445E91', '#606200'];

  // Form for granular notification preferences
  notifForm = this.fb.group({
    push: [true],
    email: [true],
    sms: [false],
    whatsapp: [true],
  });

  setCustomColor(color: string) {
    this.themeService.customColor.set(color);
    this.themeService.mode.set('custom');
  }

  saveNotifSettings() {
    console.log('Saved Preferences:', this.notifForm.value);
    // Add snackbar confirmation here
  }
}
