import { effect, Injectable, signal } from '@angular/core';

export type AppLanguage = 'en' | 'es' | 'pt-br';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  // Localization state
  readonly language = signal<AppLanguage>(
    (localStorage.getItem('preferred-lang') as AppLanguage) || 'en',
  );

  constructor() {
    // Automatically persist changes to LocalStorage
    effect(() => {
      localStorage.setItem('preferred-lang', this.language());
      // Logic to trigger translation engine (e.g., Transloco) would go here
      console.log(`Language switched to: ${this.language()}`);
    });
  }
}
