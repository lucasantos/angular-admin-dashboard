import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideQuillConfig } from 'ngx-quill/config';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { menuItems } from './menu-items';
import { validateMenuItemsConfig } from './utils/route-validator';
import { PaginatorIntlService } from './services/paginator-intl.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { loadingInterceptor } from './interceptors/loading-interceptor';
import { AuthService } from './services/auth.service';

// Validate menu/route configuration at dev time
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
    provideQuillConfig({
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }], // dropdown with heading options
          ['bold', 'italic', 'underline'], // toggled buttons
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'clean'], // remove formatting button
        ],
      },
      placeholder: 'Describe your issue in detail...',
      theme: 'snow',
    }),
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService },
    { provide: 'APP_INITIALIZER', useFactory: initializeAuth, deps: [AuthService], multi: true },
  ],
};
