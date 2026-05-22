import { effect, inject, Injectable, PLATFORM_ID, REQUEST, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';

export type LanguageCode = 'en' | 'es' | 'pt-BR';

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

  private readonly request = inject(REQUEST, { optional: true }) as any;

  readonly languages: Language[] = [
    { code: 'en', label: 'toolbar.language.english', flagClass: 'flag--us' },
    { code: 'es', label: 'toolbar.language.spanish', flagClass: 'flag--es' },
    { code: 'pt-BR', label: 'toolbar.language.portuguese', flagClass: 'flag--br' },
  ];

  readonly currentLanguage = signal<LanguageCode>(this.getInitialLanguage());

  constructor() {
    effect(() => {
      const lang = this.currentLanguage();
      this.translocoService.setActiveLang(lang);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('app-language', lang);
        document.cookie = `app-language=${lang};path=/;max-age=31536000;SameSite=Lax`;
      }
    });
  }

  setLanguage(code: LanguageCode) {
    this.currentLanguage.set(code);
  }

  private getInitialLanguage(): LanguageCode {
    if (!isPlatformBrowser(this.platformId)) {
      const cookieHeader = this.request?.headers?.cookie || '';
      const serverCookie = cookieHeader
        .split('; ')
        .find((row: string) => row.startsWith('app-language='))
        ?.split('=')[1] as LanguageCode;

      if (serverCookie && this.languages.find((l) => l.code === serverCookie)) {
        return serverCookie;
      }
      return 'en';
    }

    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('app-language='))
      ?.split('=')[1] as LanguageCode;

    if (cookieValue && this.languages.find((l) => l.code === cookieValue)) {
      return cookieValue;
    }

    const saved = localStorage.getItem('app-language') as LanguageCode;
    if (saved && this.languages.find((l) => l.code === saved)) return saved;

    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'pt') return 'pt-BR';

    return this.languages.find((l) => l.code === browserLang)
      ? (browserLang as LanguageCode)
      : 'en';
  }
}
