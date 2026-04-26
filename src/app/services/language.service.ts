import { isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export type LanguageCode = 'en' | 'es' | 'pt';

interface Language {
  code: LanguageCode;
  label: string;
  flagClass: string;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translocoService = inject(TranslocoService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly languages: Language[] = [
    { code: 'en', label: 'English', flagClass: 'flag--us' },
    { code: 'es', label: 'Spanish', flagClass: 'flag--es' },
    { code: 'pt', label: 'Portuguese', flagClass: 'flag--br' },
  ];

  // Signal for the current language, initialized from localStorage
  readonly currentLanguage = signal<LanguageCode>(this.getInitialLanguage());

  constructor() {
    // Persist language choice
    effect(() => {
      const lang = this.currentLanguage();
      // Inform the i18n engine about the language change
      this.translocoService.setActiveLang(lang);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('app-language', lang);
      }
    });
  }

  setLanguage(code: LanguageCode) {
    this.currentLanguage.set(code);
    // Note: Here you would also call translocoService.setActiveLang(code)
    // or translateService.use(code) once you add an i18n library.
  }

  private getInitialLanguage(): LanguageCode {
    if (isPlatformBrowser(this.platformId)) {
      return (localStorage.getItem('app-language') as LanguageCode) || 'en';
    }
    return 'en';
  }
}
