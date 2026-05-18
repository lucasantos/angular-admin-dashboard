# Internationalization (i18n) Guide

Complete guide to the reactive, multi-language internationalization system (English, Spanish, Brazilian Portuguese) using Angular 21, Angular Signals, and @jsverse/transloco.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Translation File Structure](#translation-file-structure)
4. [Using Translations](#using-translations)
5. [Language Selector Component](#language-selector-component)
6. [Material Component Localization](#material-component-localization)
7. [Transloco Configuration](#transloco-configuration)
8. [Translation Keys Reference](#translation-keys-reference)
9. [Best Practices](#best-practices)
10. [Server-Side Rendering (SSR) Considerations](#server-side-rendering-ssr-considerations)
11. [PWA Considerations](#pwa-considerations)
12. [Adding New Translations](#adding-new-translations)
13. [Translating Form Controls](#translating-form-controls)
14. [Testing with Internationalization](#testing-with-internationalization)
15. [Debugging Translations](#debugging-translations)
16. [Troubleshooting](#troubleshooting)
17. [Resources](#resources)
18. [Translation File Locations](translation-file-locations)
19. [Summary](#summary)

## Overview

This dashboard implements full internationalization (i18n) using **Angular 21**, **Angular Material 21**, and **@jsverse/transloco**. The system supports three languages: **English (en)**, **Spanish (es)**, and **Portuguese Brazil (pt-BR)**.

The `LanguageService` serves as the single source of truth for all language-related operations across the entire application.

## Architecture

The system utilizes a centralized state model. When the active language state changes, it synchronizes the core localization engine and sets storage keys that are parsed both by the client browser and the node server during pre-rendering.

### Data Flow

```bash
User Action (Selector Menu) → LanguageService (Signal Update)
    ↓
effect() Logic
    ├─ Synchronize Transloco Core Engine (`setActiveLang`)
    ├─ Update client-side `localStorage` cache
    └─ Update `document.cookie` (Critical for SSR interceptors)
        ↓
Dynamic Pipe Translation Engine (`| transloco`)
        ↓
Angular Material Components & App UI Text Streams
```

### Language Service (Source of Truth)

The `LanguageService` is the centralized language management service that handles:
- Current language state management using Angular signals
- Language persistence in localStorage
- Integration with Transloco for runtime translation
- Browser document language attribute management
- SSR-safe initialization

**Location:** `src/app/services/language.service.ts`

```typescript
import { isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
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

  readonly languages: Language[] = [
    { code: 'en', label: 'English', flagClass: 'flag--us' },
    { code: 'es', label: 'Spanish', flagClass: 'flag--es' },
    { code: 'pt-BR', label: 'Portuguese (Brazil)', flagClass: 'flag--br' },
  ];

  // Signal for the current language
  readonly currentLanguage = signal<LanguageCode>(this.getInitialLanguage());

  constructor() {
    // Persist language choice and sync with Transloco
    effect(() => {
      const lang = this.currentLanguage();
      this.translocoService.setActiveLang(lang);
      this.updateDocumentLanguage(lang);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('app-language', lang);
      }
    });
  }

  /**
   * Change the application language
   * @param code Language code to switch to
   */
  setLanguage(code: LanguageCode): void {
    this.currentLanguage.set(code);
  }

  /**
   * Check if a specific language is currently active
   * @param code Language code to check
   * @returns true if the language is active
   */
  isActiveLanguage(code: LanguageCode): boolean {
    return this.currentLanguage() === code;
  }

  /**
   * Get the label for a language code
   * @param code Language code
   * @returns Language label
   */
  getLanguageLabel(code: LanguageCode): string {
    return this.languages.find(l => l.code === code)?.label || code;
  }

  /**
   * Initialize language from localStorage or browser settings
   * @returns Initial language code
   */
  private getInitialLanguage(): LanguageCode {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('app-language') as LanguageCode | null;
      if (saved && this.isValidLanguage(saved)) {
        return saved;
      }

      // Fallback to browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('es')) return 'es';
      if (browserLang.startsWith('pt')) return 'pt-BR';
    }

    return 'en';
  }

  /**
   * Validate if a language code is supported
   * @param code Language code to validate
   * @returns true if language is supported
   */
  private isValidLanguage(code: string): boolean {
    return this.languages.some(l => l.code === code as LanguageCode);
  }

  /**
   * Update the document's lang attribute and direction
   * @param lang Language code
   */
  private updateDocumentLanguage(lang: LanguageCode): void {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }
}
```

## Translation File Structure

Translation files are located in `public/assets/i18n/` with the following structure:

- `en.json` - English translations (source of truth)
- `es.json` - Spanish translations
- `pt-BR.json` - Portuguese (Brazil) translations

### Key Organization

Keys are organized into logical namespaces for better maintainability:

```json
{
  "menu": { },          // Navigation menu items
  "toolbar": { },       // Toolbar buttons and tooltips
  "auth": { },          // Authentication-related strings
  "settings": { },      // Settings page strings
  "profile": { },       // Profile page strings
  "feedback": { },      // Feedback center strings
  "faq": { },           // FAQ page strings
  "help": { },          // Help menu strings
  "support": { },       // Support ticket strings
  "theme": { },         // Theme selector strings
  "languages": { },     // Language names
  "buttons": { },       // Common button labels
  "labels": { },        // Common form labels
  "messages": { },      // Toast/notification messages
  "pagination": { },    // Pagination strings
  "search": { }         // Search-related strings
}
```

## Using Translations

### 1. In Templates with Transloco Directive

**Basic usage:**
```html
<h1>{{ 'menu.dashboard' | transloco }}</h1>
```

**With namespace context:**
```html
<div *transloco="let t; read: 'settings'">
  <h1>{{ t('title') }}</h1>
  <p>{{ t('subtitle') }}</p>
</div>
```

**With variables:**
```html
<p>{{ 'messages.created' | transloco : { name: itemName } }}</p>
```

### 2. In TypeScript Components

**Using the Transloco service:**
```typescript
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Component({...})
export class MyComponent {
  private translocoService = inject(TranslocoService);

  // Synchronous translation
  title = this.translocoService.translate('menu.dashboard');

  // Observable translation (reactive)
  title$ = this.translocoService.selectTranslate('menu.dashboard');

  // With parameters
  message$ = this.translocoService.selectTranslate('messages.created', {
    name: this.itemName
  });

  // In methods
  showNotification() {
    const message = this.translocoService.translate('messages.success');
    console.log(message);
  }
}
```

### 3. Using Language Service

**Changing language:**
```typescript
import { inject } from '@angular/core';
import { LanguageService } from '@app/services/language.service';

@Component({...})
export class MyComponent {
  languageService = inject(LanguageService);

  changeLanguage() {
    this.languageService.setLanguage('es');
  }
}
```

**Accessing current language:**
```typescript
export class MyComponent {
  languageService = inject(LanguageService);

  // Using signal
  currentLang = this.languageService.currentLanguage();

  // Check if language is active
  isSpanish = this.languageService.isActiveLanguage('es');
}
```

## Language Selector Component

The `LanguageSelector` component provides a UI for users to switch languages:

**Location:** `src/app/components/tools/language-selector/`

```typescript
// language-selector.ts
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { LanguageCode, LanguageService } from '../../../services/language.service';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-language-selector',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltip,
    TranslocoDirective,
  ],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.scss',
})
export class LanguageSelector {
  protected readonly languageService = inject(LanguageService);

  changeLanguage(code: LanguageCode) {
    this.languageService.setLanguage(code);
  }
}
```

```html
<!-- language-selector.html -->
<button
  mat-icon-button
  [matMenuTriggerFor]="langMenu"
  [matTooltip]="'toolbar.language' | transloco"
  aria-label="Language menu"
>
  <mat-icon>language</mat-icon>
</button>

<mat-menu #langMenu="matMenu">
  @for (lang of languageService.languages; track lang.code) {
  <button
    mat-menu-item
    (click)="changeLanguage(lang.code)"
    [class.active-lang]="languageService.isActiveLanguage(lang.code)"
  >
    <mat-icon [class]="lang.flagClass"></mat-icon>
    <span>{{ lang.label }}</span>
  </button>
  }
</mat-menu>
```

## Material Component Localization

Angular Material components like `MatPaginator` need localization support. This is handled through the `PaginatorIntlService`:

**Location:** `src/app/services/paginator-intl.service.ts`

```typescript
import { inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class PaginatorIntlService extends MatPaginatorIntl {
  private readonly translocoService = inject(TranslocoService);

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return `${start} – ${end} ${this.translocoService.translate('pagination.of')} ${length}`;
  };

  constructor() {
    super();
    this.itemsPerPageLabel = this.translocoService.translate('pagination.itemsPerPage');
    this.firstPageLabel = this.translocoService.translate('pagination.first');
    this.previousPageLabel = this.translocoService.translate('pagination.previous');
    this.nextPageLabel = this.translocoService.translate('pagination.next');
    this.lastPageLabel = this.translocoService.translate('pagination.last');
  }
}
```

**Provider in app.config.ts:**
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    // ...other providers
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService },
  ],
};
```

## Transloco Configuration

### 1. Configuration File

**Location:** `transloco.config.ts`

```typescript
import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

const config: TranslocoGlobalConfig = {
  rootTranslationsPath: 'assets/i18n/',
  langs: ['en', 'es', 'pt-BR'],
  keysManager: {},
};

export default config;
```

### 2. App Configuration

**Location:** `src/app/app.config.ts`

```typescript
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTransloco({
      config: {
        availableLangs: ['en', 'es', 'pt-BR'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    // ...other providers
  ],
};
```

### 3. HTTP Loader

**Location:** `src/app/transloco-loader.ts`

```typescript
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}
```

## Translation Keys Reference

### Menu Keys
```json
{
  "menu": {
    "dashboard": "Dashboard",
    "content": "Content",
    "articles": "Articles",
    // ... (refer to public/assets/i18n/en.json for complete list)
  }
}
```

### Toolbar Keys
```json
{
  "toolbar": {
    "theme": "Switch style mode",
    "language": "Switch language",
    "help": "Help",
    "notifications": "View notifications",
    "account": "Account menu",
    "collapseMenu": "Collapse menu",
    "expandMenu": "Expand menu",
    "search": "Search..."
  }
}
```

### Authentication Keys
```json
{
  "auth": {
    "login": {
      "title": "Welcome Back",
      "subtitle": "Sign in to your admin dashboard",
      "email": "Email Address",
      "password": "Password",
      "signIn": "Sign In",
      "authenticating": "Authenticating..."
    }
  }
}
```

### Settings Keys
```json
{
  "settings": {
    "title": "Account Settings",
    "appearance": {
      "title": "Appearance & Branding",
      "displayMode": "Display Mode",
      "light": "Light Mode",
      "dark": "Dark Mode",
      "system": "System Preference"
    },
    "language": {
      "title": "System Language"
    },
    "communication": {
      "title": "Communication Channels"
    }
  }
}
```

**For complete reference, see:** `public/assets/i18n/en.json`

## Best Practices

### 1. Always Use Translation Keys

❌ **Bad:**
```html
<h1>Dashboard</h1>
```

✅ **Good:**
```html
<h1>{{ 'menu.dashboard' | transloco }}</h1>
```

### 2. Use Namespaces for Context

❌ **Bad:**
```html
<div *transloco="let t">
  <p>{{ t('title') }}</p>
  <p>{{ t('subtitle') }}</p>
</div>
```

✅ **Good:**
```html
<div *transloco="let t; read: 'settings'">
  <p>{{ t('title') }}</p>
  <p>{{ t('subtitle') }}</p>
</div>
```

### 3. Organize Keys Logically

Keep related translations in the same namespace for easier maintenance:

```json
{
  "feedback": {
    "title": "Feedback Center",
    "categories": {
      "ui_ux": "UI/UX Design",
      "feature_request": "Feature Request"
    }
  }
}
```

### 4. Use Constants for Repeated Keys

For keys used in multiple places, consider storing them as constants:

```typescript
export const TRANSLATION_KEYS = {
  MENU_DASHBOARD: 'menu.dashboard',
  SETTINGS_TITLE: 'settings.title',
  BUTTONS_SAVE: 'buttons.save',
} as const;

// Usage
this.translocoService.translate(TRANSLATION_KEYS.MENU_DASHBOARD);
```

### 5. Handle Missing Translations Gracefully

Always provide fallback text:

```html
<h1>{{ 'menu.unknown' | transloco : { defaultValue: 'Unknown' } }}</h1>
```

### 6. Translate Form Labels and Validation Messages

```typescript
// In form creation
this.form = this.fb.group({
  email: [
    '',
    [
      Validators.required,
      Validators.email,
    ]
  ]
});

// In template
<mat-form-field>
  <mat-label>{{ 'labels.email' | transloco }}</mat-label>
  <input matInput formControlName="email">
  @if (form.get('email')?.hasError('required')) {
    <mat-error>{{ 'messages.required' | transloco }}</mat-error>
  }
</mat-form-field>
```

## Server-Side Rendering (SSR) Considerations

### 1. Language Detection on Server

The `LanguageService` safely detects the initial language on the server by defaulting to English:

```typescript
private getInitialLanguage(): LanguageCode {
  if (isPlatformBrowser(this.platformId)) {
    // Browser-only logic
    const saved = localStorage.getItem('app-language') as LanguageCode | null;
    if (saved) return saved;
    // Use browser language
  }
  return 'en'; // Server default
}
```

### 2. Language Persistence

Language preference is persisted only in the browser via localStorage:

```typescript
if (isPlatformBrowser(this.platformId)) {
  localStorage.setItem('app-language', lang);
}
```

### 3. Hydration Safety

On client hydration, the saved language from localStorage is restored automatically.

## PWA Considerations

### 1. Service Worker Compatibility

Translation files are cached by the Service Worker. Update `ngsw-config.json` if needed:

```json
{
  "dataGroups": [
    {
      "name": "translations",
      "urls": ["/assets/i18n/**"],
      "cacheConfig": {
        "strategy": "performance",
        "maxAge": "7d",
        "maxSize": 10
      }
    }
  ]
}
```

### 2. Offline Support

Ensure the current language's translation file is pre-cached before going offline.

## Adding New Translations

### Step 1: Add Key to en.json

```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  }
}
```

### Step 2: Add Translations to Other Languages

**es.json:**
```json
{
  "myFeature": {
    "title": "Mi Función",
    "description": "Descripción de la función"
  }
}
```

**pt-BR.json:**
```json
{
  "myFeature": {
    "title": "Meu Recurso",
    "description": "Descrição do recurso"
  }
}
```

### Step 3: Use in Application

```html
<h1>{{ 'myFeature.title' | transloco }}</h1>
<p>{{ 'myFeature.description' | transloco }}</p>
```

## Translating Form Controls

### Material Select with Translated Options

```typescript
@Component({...})
export class MyComponent {
  translocoService = inject(TranslocoService);

  categories = [
    { value: 'ui_ux', label: 'feedback.categories.ui_ux' },
    { value: 'bug', label: 'feedback.categories.bug_report' },
  ];
}
```

```html
<mat-form-field>
  <mat-label>{{ 'feedback.category' | transloco }}</mat-label>
  <mat-select>
    @for (category of categories; track category.value) {
      <mat-option [value]="category.value">
        {{ category.label | transloco }}
      </mat-option>
    }
  </mat-select>
</mat-form-field>
```

## Testing with Internationalization

### Example Unit Test

```typescript
import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { TranslocoService } from '@jsverse/transloco';

describe('LanguageService', () => {
  let service: LanguageService;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        {
          provide: TranslocoService,
          useValue: jasmine.createSpyObj('TranslocoService', ['setActiveLang']),
        },
      ],
    });

    service = TestBed.inject(LanguageService);
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
  });

  it('should set language and call transloco service', () => {
    service.setLanguage('es');

    expect(translocoService.setActiveLang).toHaveBeenCalledWith('es');
    expect(service.currentLanguage()).toBe('es');
  });

  it('should check if language is active', () => {
    service.setLanguage('en');

    expect(service.isActiveLanguage('en')).toBe(true);
    expect(service.isActiveLanguage('es')).toBe(false);
  });
});
```

## Debugging Translations

### 1. Transloco DevTools

The Transloco library provides DevTools for development:

```typescript
// In development environment
if (!environment.production) {
  import('@jsverse/transloco-locale').then(({ TranslocoLocaleModule }) => {
    // DevTools setup
  });
}
```

### 2. Console Logging

```typescript
// Check current language
console.log(this.translocoService.getActiveLang());

// Get all translations for current language
console.log(this.translocoService.translations);

// Translate a key
console.log(this.translocoService.translate('menu.dashboard'));
```

### 3. Browser Inspection

Use Angular DevTools to inspect the `LanguageService` signal and verify language state changes.

## Troubleshooting

### Problem: Translations Not Loading

**Solution:** Verify the translation file path in `transloco-loader.ts`:
```typescript
getTranslation(lang: string) {
  return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
}
```

### Problem: Language Not Persisting After Refresh

**Solution:** Check that localStorage is available and not disabled:
```typescript
if (isPlatformBrowser(this.platformId)) {
  localStorage.setItem('app-language', lang);
}
```

### Problem: Material Labels Not Translated

**Solution:** Ensure `PaginatorIntlService` is provided in `app.config.ts`:
```typescript
{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }
```

## Resources

- [Transloco Documentation](https://ngneat.github.io/transloco)
- [Angular i18n Guide](https://angular.io/guide/i18n)
- [Angular Material i18n](https://material.angular.io/guide/using-component-harnesses)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

## Translation File Locations

- **English:** `public/assets/i18n/en.json`
- **Spanish:** `public/assets/i18n/es.json`
- **Portuguese (Brazil):** `public/assets/i18n/pt-BR.json`

## Summary

The internationalization system is built on:

1. **LanguageService** - Single source of truth for language management
2. **Transloco** - Runtime translation engine
3. **Translation Files** - Centralized key-value pairs organized by namespace
4. **Angular Signals** - Reactive language state management
5. **localStorage** - Persistent language preference
6. **SSR/PWA Safe** - Works correctly in server-side rendering and PWA environments

This architecture ensures:
- ✅ Consistent language handling across the app
- ✅ Easy maintenance and updates to translations
- ✅ Reactive UI updates when language changes
- ✅ SSR and PWA compatibility
- ✅ Accessibility compliance
- ✅ Performance optimization through lazy loading
