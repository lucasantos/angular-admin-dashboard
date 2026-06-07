// services/theme.service.ts
import { Injectable, signal, effect, inject, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Added 'custom' to the type
export type ThemeMode = 'light' | 'dark' | 'system' | 'custom';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(RendererFactory2).createRenderer(null, null);

  readonly mode = signal<ThemeMode>(this.getInitialMode());
  // Store the custom hex code (defaulting to a Material Violet)
  readonly customColor = signal<string>(
    (isPlatformBrowser(this.platformId) && localStorage.getItem('custom-color')) || '#6750A4',
  );

  constructor() {
    effect(() => {
      const mode = this.mode();
      const color = this.customColor();

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme-mode', mode);
        localStorage.setItem('custom-color', color);
        this.applyTheme(mode, color);
      }
    });
  }

  private getInitialMode(): ThemeMode {
    if (isPlatformBrowser(this.platformId)) {
      return (localStorage.getItem('theme-mode') as ThemeMode) || 'system';
    }
    return 'system';
  }

  private applyTheme(mode: ThemeMode, customHex: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    const html = document.documentElement;
    let isDark = mode === 'dark';

    if (mode === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Toggle Dark Class
    isDark
      ? this.renderer.addClass(html, 'dark-mode')
      : this.renderer.removeClass(html, 'dark-mode');
    this.renderer.setProperty(html.style, 'color-scheme', isDark ? 'dark' : 'light');

    // Custom Color Logic
    if (mode === 'custom') {
      // We override the Material 3 Primary tokens directly in the style attribute
      // In a real M3 palette, you'd calculate shades, but for now, we'll override the main seed
      html.style.setProperty('--mat-sys-primary', customHex);
      html.style.setProperty('--mat-sys-on-primary', '#ffffff');
      html.style.setProperty('--mat-sys-primary-container', `${customHex}33`); // 20% opacity for container
    } else {
      // Clear custom overrides when switching back to standard modes
      html.style.removeProperty('--mat-sys-primary');
      html.style.removeProperty('--mat-sys-on-primary');
      html.style.removeProperty('--mat-sys-primary-container');
    }
  }
}
