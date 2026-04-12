import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { LanguageCode, LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-language-selector',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatTooltip],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.scss',
})
export class LanguageSelector {
  protected readonly langService = inject(LanguageService);

  changeLanguage(code: LanguageCode) {
    this.langService.setLanguage(code);
  }
}
