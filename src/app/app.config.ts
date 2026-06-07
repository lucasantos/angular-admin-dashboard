import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { provideQuillConfig } from 'ngx-quill/config';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { menuItems } from './core/navigation/menu-items';
import { validateMenuItemsConfig } from './shared/utils/route-validator';
import { TranslocoHttpLoader } from './core/i18n/transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { PaginatorIntlService } from './core/services/paginator-intl.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { AuthService } from './core/services/auth.service';
import { I18nTitleStrategy } from './core/i18n/i18n-title.strategy';

if (isDevMode()) {
  validateMenuItemsConfig(menuItems, false);
}

function initializeAuth(authService: AuthService) {
  return () => {
    authService.restoreSession();
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor])),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es', 'pt-BR'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideQuillConfig({
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'clean'],
        ],
      },
      placeholder: 'Describe your issue in detail...',
      theme: 'snow',
    }),
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService },
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      authService.restoreSession();
    }),
    { provide: TitleStrategy, useClass: I18nTitleStrategy },
  ],
};
