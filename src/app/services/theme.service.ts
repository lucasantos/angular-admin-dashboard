import { Injectable, signal, effect, inject, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(RendererFactory2).createRenderer(null, null);

  // 1. Safe Initialization
  // If on server, default to 'system'. If in browser, try localStorage.
  readonly mode = signal<ThemeMode>(this.getInitialMode());

  constructor() {
    // 2. Reactive Effect
    effect(() => {
      const mode = this.mode();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme-mode', mode);
        this.applyTheme(mode);
      }
    });

    // 3. System Listener (Browser Only)
    if (isPlatformBrowser(this.platformId)) {
      globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.mode() === 'system') this.applyTheme('system');
      });
    }
  }

  private getInitialMode(): ThemeMode {
    if (isPlatformBrowser(this.platformId)) {
      return (localStorage.getItem('theme-mode') as ThemeMode) || 'system';
    }
    return 'system'; // Default for Server rendering
  }

  private applyTheme(mode: ThemeMode) {
    if (!isPlatformBrowser(this.platformId)) return;

    const html = document.documentElement;
    let isDark = mode === 'dark';

    if (mode === 'system') {
      isDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      this.renderer.addClass(html, 'dark-mode');
      this.renderer.setProperty(html.style, 'color-scheme', 'dark');
    } else {
      this.renderer.removeClass(html, 'dark-mode');
      this.renderer.setProperty(html.style, 'color-scheme', 'light');
    }
  }
}
