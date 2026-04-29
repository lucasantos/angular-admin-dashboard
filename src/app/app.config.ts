import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideQuillConfig } from 'ngx-quill/config';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { menuItems } from './menu-items';
import { validateMenuItemsConfig } from './utils/route-validator';

// Validate menu/route configuration at dev time
if (isDevMode()) {
  validateMenuItemsConfig(menuItems, false);
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
    provideHttpClient(withFetch()),
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
  ],
};
