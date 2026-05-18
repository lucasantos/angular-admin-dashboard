import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class I18nTitleStrategy extends TitleStrategy {
  private readonly transloco = inject(TranslocoService);
  private readonly titleService = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titleKey = this.buildTitle(snapshot); // Retrieves data.label ('menu.dashboard')

    if (titleKey) {
      const localized = this.transloco.translate(titleKey);
      this.titleService.setTitle(`Platform — ${localized}`);
    } else {
      this.titleService.setTitle('Platform Suite');
    }
  }
}
