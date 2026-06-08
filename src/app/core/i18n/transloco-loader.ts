import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject<HttpClient>(HttpClient);

  getTranslation(lang: string) {
    // In SSR, Angular will handle absolute path resolution if configured.
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}
