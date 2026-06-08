import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { LanguageCode, LanguageService } from '../../../../core/services/language.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-language-selector',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltip,
    TranslocoPipe,
  ],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.scss',
})
export class LanguageSelector {
  protected readonly languageService = inject<LanguageService>(LanguageService);

  changeLanguage(code: LanguageCode) {
    this.languageService.setLanguage(code);
  }
}
