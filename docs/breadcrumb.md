# Breadcrumb Implementation Guide

A detailed reference for the current reactive breadcrumb implementation in the Angular Admin Dashboard.

---

## Table of Contents

1. [Overview](#overview)
2. [Files and Responsibilities](#files-and-responsibilities)
3. [BreadcrumbService](#breadcrumbservice)
4. [Dynamic Resolvers](#dynamic-resolvers)
5. [Breadcrumb Component](#breadcrumb-component)
6. [Template Behavior](#template-behavior)
7. [Routing Integration](#routing-integration)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The breadcrumb system generates a navigation trail from the active Angular route tree. It uses:

- Angular Signals for reactive state management.
- `Router` events and `TranslocoService` translation state.
- Route data and resolver output to support both static labels and dynamic labels like user names.
- A recursive tree walker to build the trail from nested routes.

---

## Files and Responsibilities

- `src/app/services/breadcrumb.service.ts`
  - Builds the breadcrumb trail.
  - Stores breadcrumb state.
  - Formats labels and applies dynamic overrides.

- `src/app/services/user-breadcrumb-resolver.ts`
  - Resolves a dynamic breadcrumb label for a user detail page.

- `src/app/components/breadcrumb/breadcrumb.ts`
  - Exposes breadcrumb signals to the template.
  - Calculates whether the trail must collapse and which items are hidden.

- `src/app/components/breadcrumb/breadcrumb.html`
  - Renders the breadcrumb UI.
  - Shows a home anchor, collapsed menu, and active last item.

---

## BreadcrumbService

The service is the core of the implementation.

### State

```ts
private readonly dynamicLabels = signal<Map<string, string>>(new Map());
private readonly breadcrumbsSignal = signal<BreadcrumbItem[]>([]);

readonly filteredBreadcrumbs = computed(() =>
  this.breadcrumbsSignal().map((item) => {
    const dynamicLabel = this.dynamicLabels().get(item.url);
    const finalLabel = dynamicLabel || item.label;

    return {
      ...item,
      label: finalLabel.replaceAll('_', ' ').toUpperCase(),
    };
  }),
);
```

- `breadcrumbsSignal` holds the raw breadcrumb items.
- `filteredBreadcrumbs` formats each label by replacing `_` with spaces and converting to uppercase.
- `setDynamicLabel(url, label)` allows runtime overrides for breadcrumbs.

### Router and Translation Synchronization

The service listens for navigation completion and waits for translation data:

```ts
const routerEvents$ = this.router.events.pipe(
  filter((event) => event instanceof NavigationEnd),
  startWith(null),
);

combineLatest([routerEvents$, this.translocoService.selectTranslation()])
  .pipe(takeUntilDestroyed())
  .subscribe(() => {
    const rootSnapshot = this.router.routerState.snapshot.root;
    const breadcrumbs: BreadcrumbItem[] = [];
    this.buildBreadcrumbs(rootSnapshot, '', breadcrumbs);
    this.breadcrumbsSignal.set(breadcrumbs);
  });
```

This guarantees the breadcrumb trail is refreshed after both route activation and translation loading.

### Recursive Breadcrumb Construction

`buildBreadcrumbs()` walks the active route tree and appends breadcrumb items only for the `primary` outlet.

```ts
private buildBreadcrumbs(
  route: any,
  url: string = '',
  breadcrumbs: BreadcrumbItem[] = [],
): void {
  const children = route.children;

  if (children.length === 0) return;

  for (const child of children) {
    if (child.outlet === 'primary') {
      const routeURL: string = child.url.map((segment: any) => segment.path).join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const resolvedLabel = child.data['resolvedLabel'];
      const staticLabel = child.data['label'];

      if (resolvedLabel || staticLabel) {
        const label = resolvedLabel || this.translocoService.translate(staticLabel);
        const icon = child.data['icon'];

        breadcrumbs.push({ label, url: url || '/', icon });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }
  }
}
```

- `resolvedLabel` is used first when a resolver provides dynamic data.
- The static `label` is translated synchronously.
- If a route segment has no breadcrumb data, it is skipped.

---

## Dynamic Resolvers

Dynamic breadcrumb labels are resolved through route `resolve` metadata.

### Example resolver

```ts
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import { map, of } from 'rxjs';

export const userBreadcrumbResolver: ResolveFn<string> = (route) => {
  const userService = inject(UserService);
  const userId = route.paramMap.get('id');

  if (!userId) return of('messages.unknownUser');

  return userService.getUserById(userId).pipe(
    map((user) => (user ? user.name : 'messages.userNotFound')),
  );
};
```

- The resolver returns a string label for the breadcrumb.
- It handles missing IDs and missing users gracefully.
- `resolvedLabel` is allowed to be a plain label or a translation key.

---

## Breadcrumb Component

The component exposes the current breadcrumb trail and prepares the UI state.

```ts
protected readonly allBreadcrumbs = this.breadcrumbService.filteredBreadcrumbs;
readonly MAX_VISIBLE = 4;
readonly needsToCollapse = computed(() => this.allBreadcrumbs().length > this.MAX_VISIBLE);
readonly firstItem = computed(() => this.allBreadcrumbs()[0]);
readonly lastItem = computed(() => this.allBreadcrumbs()[this.allBreadcrumbs().length - 1]);
readonly hiddenItems = computed(() => this.allBreadcrumbs().slice(1, -1));
```

- `MAX_VISIBLE` controls how many items are shown before collapsing.
- `hiddenItems` is the set of breadcrumbs between the first and last item.
- `needsToCollapse` determines whether the overflow menu should be shown.

---

## Template Behavior

The breadcrumb template renders:

- a home icon anchor when not already on `/dashboard` or `/`
- the first breadcrumb item as a clickable link
- hidden items in a `mat-menu` when the trail is too long
- the active last item as plain text

### Rendering logic

```html
<nav class="breadcrumb-container" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    @if (firstItem(); as item) {
      @if (item.url !== '/dashboard' && item.url !== '/') {
        <li class="breadcrumb-item home-anchor">
          <a routerLink="/dashboard" class="breadcrumb-link" [title]="'breadcrumb.homeTitle' | transloco">
            <mat-icon class="breadcrumb-icon">home</mat-icon>
          </a>
          <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
        </li>
      }
      <li class="breadcrumb-item">
        <a [routerLink]="item.url" class="breadcrumb-link">
          <span class="breadcrumb-label">{{ item.label }}</span>
        </a>
        <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
      </li>
    }

    @if (needsToCollapse()) {
      <li class="breadcrumb-item">
        <button mat-icon-button [matMenuTriggerFor]="breadcrumbMenu" class="breadcrumb-more">
          <mat-icon>more_horiz</mat-icon>
        </button>
        <mat-menu #breadcrumbMenu="matMenu">
          @for (hidden of hiddenItems(); track hidden.url) {
            <a mat-menu-item [routerLink]="hidden.url">
              @if (hidden.icon) { <mat-icon>{{ hidden.icon }}</mat-icon> }
              <span>{{ hidden.label }}</span>
            </a>
          }
        </mat-menu>
        <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
      </li>
    } @else {
      @for (item of hiddenItems(); track item.url) {
        <li class="breadcrumb-item">
          <a [routerLink]="item.url" class="breadcrumb-link">{{ item.label }}</a>
          <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
        </li>
      }
    }

    @if (lastItem(); as item) {
      @if (allBreadcrumbs().length > 1) {
        <li class="breadcrumb-item active" aria-current="page">
          <span class="breadcrumb-label">{{ item.label }}</span>
        </li>
      }
    }
  </ol>
</nav>
```

---

## Routing Integration

Breadcrumbs depend on route metadata delivered via `data` and `resolve` keys.

### Static breadcrumb data

```ts
{ path: 'settings', data: { label: 'breadcrumb.settings', icon: 'settings' } }
```

### Dynamic breadcrumb data

```ts
{ path: 'user/:id', data: { icon: 'person' }, resolve: { resolvedLabel: userBreadcrumbResolver } }
```

- The service reads `child.data['resolvedLabel']` first.
- If that key is missing, it falls back to `child.data['label']`.
- Only routes with one of these values produce breadcrumb items.

---

## Best Practices

- Use `resolvedLabel` for any breadcrumb item that depends on API data.
- Avoid rendering breadcrumb segments for unnamed routes.
- Keep the main app content in the `primary` outlet, since the service only walks that outlet.
- Prefer `user.name` or another friendly string for resolved label output.
- Call `setDynamicLabel(url, label)` when runtime changes must override breadcrumb labels after navigation.

---

## Troubleshooting

### Breadcrumb shows route slug instead of friendly text

- Confirm that `data.label` exists and is a translation key.
- Confirm that a resolver returns a label if the route uses `resolvedLabel`.
- Verify that `TranslocoService.selectTranslation()` is available so translations resolve before trail generation.

### Breadcrumb list is empty or incomplete

- Check that the route is inside the `primary` outlet.
- Ensure nested routes are defined in a parent/child structure.
- Make sure the route segment has `data.label` or `resolve.resolvedLabel`.

### Breadcrumb link navigation fails

- Validate the constructed URLs are absolute and start with `/`.
- If a segment is empty, the service uses `url || '/'`.

---

## Notes

This implementation is intentionally minimal in component and service code. All route and breadcrumb behavior should be documented in `docs/breadcrumb.md` rather than within source comments.
