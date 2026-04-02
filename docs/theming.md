# Theme System Implementation Guide

Complete guide to the reactive, multi-mode theming system (Light, Dark, System, Custom) using Angular 21 and Material 3.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [The Theme Engine (Service)](#the-theme-engine)
4. [Material 3 Styling (SCSS)](#styling)
5. [Custom Mode & Dynamic Colors](#customization)
6. [UI Implementation](#ui-implementation)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Summary](#summary)

---

## Overview

The theming system provides a seamless, high-performance way to toggle between visual identities. Key features include:

- **Material 3 Tokens**: Uses CSS Custom Properties instead of redundant SCSS mixins.
- **SSR Compatibility**: Safe for Server-Side Rendering via `PLATFORM_ID` checks.
- **Reactive Persistence**: Uses Angular Signals and `effect()` to sync with `localStorage`
- **System Synchronization**: Automatically reacts to OS-level color scheme changes.
- **Custom Brand Identity**: Allows users to inject a custom "Seed Color" to re-theme the entire app at runtime.

---

## Architecture

The system uses a "top-down" approach. A single class or style on the `<html>` element triggers a cascade of CSS variable updates throughout the component tree.

### Data Flow

```bash
User Action (Menu) → ThemeService (Signal Update) 
    ↓
effect() Logic 
    ├─ Update localStorage
    ├─ Toggle .dark-mode class on <html>
    └─ (Optional) Inject Custom CSS Variables
        ↓
CSS Tokens (var(--mat-sys-primary))
    ↓
Angular Material Components & App UI
```

---

## The Theme Engine (Service)

The `ThemeService` is the source of truth. It handles environment detection and state management.

### SSR-Safe Signal Logic

By using `isPlatformBrowser`, we prevent the "localStorage is not defined" error during server-side builds.

```typescript
readonly mode = signal<ThemeMode>(this.getInitialMode());

private getInitialMode(): ThemeMode {
  if (isPlatformBrowser(this.platformId)) {
    return (localStorage.getItem('theme-mode') as ThemeMode) || 'system';
  }
  return 'system';
}
```

### The Effect Hook

The `effect()` is used to reactively update the DOM whenever the mode signal changes. This eliminates the need for manual subscriptions.

---

## Material 3 Styling (SCSS)

In Angular 21, the `styles.scss` defines how these modes behave. We apply the Light theme as the base and use `all-component-colors` to override variables for Dark mode.

### Density Configuration

**Crucial Note**: In M3, density must be an object, not a raw number.

```scss
$light-theme: mat.define-theme((
  color: ( ... ),
  density: (scale: 0), // Correct M3 syntax
));

html {
  @include mat.all-component-themes($light-theme);

  &.dark-mode {
    @include mat.all-component-colors($dark-theme);
  }
}
```

---

## Custom Mode & Dynamic Colors

Custom mode bypasses the pre-compiled Material palettes by overriding CSS tokens directly on the `document.documentElement`.

### Implementation Logic

```typescript
if (mode === 'custom') {
  html.style.setProperty('--mat-sys-primary', customHex);
  html.style.setProperty('--mat-sys-primary-container', `${customHex}33`); // Transparent variant
} else {
  html.style.removeProperty('--mat-sys-primary'); // Return to standard palettes
}
```

---

## UI Implementation

The `Tools` component provides the interface for theme switching. It uses a mat-menu to group standard modes and custom color presets.

### The Color Grid

```html
<div class="color-grid">
  @for (color of presets; track color) {
    <button class="color-option" 
            [style.background-color]="color" 
            (click)="setCustomColor(color)">
    </button>
  }
</div>
```

---

## Best Practices

1. **Use System Tokens**: Never use hex codes like `#ffffff` in your component SCSS. Always use `var(--mat-sys-surface)` or var `(--mat-sys-on-surface)`.
2. **Color-Scheme Property**: Always update the `color-scheme` CSS property on the `html` tag. This ensures native scrollbars and form inputs match the theme.
3. **Smooth Transitions**: Apply transitions to `background-color` and `color` on the `body` selector to prevent jarring "flashes" during theme switches.
4. **Token Hierarchy**: Prefer `surface-container` for cards and sidenavs, and `urface` for the main page background.

---

## Troubleshooting

**`localStorage is not defined`**:

**Cause**: Code is running on the server (SSR).

**Fix**: Wrap the call in `if (isPlatformBrowser(platformId))`.

**`$config.density should be a density configuration object`**:

**Cause**: Passing a number (0) instead of a configuration map.

**Fix**: Use `density: (scale: 0)`.

**`Theme doesn't apply to custom components`**:

**Cause**: The component is using hardcoded colors.

**Fix**: Replace hex codes with Material System variables.

---

## Summary

The Angular 21 theme system leverages the power of **Material 3 Tokens** and Signals to create a highly flexible UI. By separating the "Mode" (Logic) from the "Palette" (CSS Variables), we achieve a solution that is both lightweight and deeply customizable.

✅ Persistent - Saved to local storage automatically.

✅ Performant - No runtime SCSS compilation needed.

✅ Accessible - Respects system-level OS preferences.

✅ Dynamic - Allows full brand identity customization via seed colors.
