# Dynamic Route Implementation & Route Validator

Complete guide to the dynamic routing system and route validation in the Angular Admin Dashboard.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [How It Works](#how-it-works)
4. [Dynamic Routes](#dynamic-routes)
5. [Route Validator](#route-validator)
6. [Menu Items Configuration](#menu-items-configuration)
7. [Usage Examples](#usage-examples)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [API Reference](#api-reference)

---

## Overview

This project implements a **data-driven dynamic routing system** where routes are generated from a centralized `menuItems` configuration array. This approach provides:

- **Single source of truth** for navigation structure
- **Automatic validation** of route configuration
- **Type-safe** menu and route definitions
- **Lazy-loaded components** for optimal performance
- **Nested route support** for complex hierarchies
- **Dev-time error detection** before runtime failures

---

## Architecture

### Component Hierarchy

```
app.config.ts (Auto-validates menuItems at startup)
    ↓
menuItems.ts (Route configuration data)
    ↓
app.routes.ts (Generates Angular routes from menuItems)
    ├─ itemToRoute() (Converter function)
    └─ routes: Routes[] (Final Angular route definitions)

route-validator.ts (Validates configuration)
    ├─ RouteValidator class
    └─ validateMenuItemsConfig() entry point
```

### Data Flow

```
menuItems (config data)
    ↓
itemToRoute() function
    ├─ Extracts path
    ├─ Maps component loader
    ├─ Adds metadata (label, icon, class)
    └─ Processes children recursively
    ↓
routes: Routes[] (Angular route objects)
    ↓
RouterModule (Angular routing system)
```

---

## How It Works

### 1. Menu Items Configuration

Define your routes in `src/app/menu-items.ts`:

```typescript
export const menuItems: MenuItems[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    component: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  // ... more items
];
```

### 2. Route Converter

The `itemToRoute()` function in `src/app/app.routes.ts` transforms each menu item into an Angular route:

```typescript
const itemToRoute = (i: MenuItems): Route | null => {
  const path = i.route ? i.route.replace(/^\//, '') : '';
  
  const route: Route = {
    path,
    data: {
      label: i.label,
      icon: i.icon,
      class: i.class,
    },
  };

  if (i.component) {
    route.loadComponent = i.component as () => Promise<Type<unknown>>;
  }

  if (i.subItems) {
    const children = i.subItems.map((s) => itemToRoute(s)).filter(Boolean) as Route[];
    if (children.length) {
      route.children = children;
    }
  }

  return route;
};
```

### 3. Route Registration

Routes are exported and passed to the Angular router:

```typescript
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  ...menuItems
    .map((i) => itemToRoute(i))
    .filter((r): r is Route => r !== null),
];
```

### 4. Automatic Validation

Routes are validated at app startup (dev mode only):

```typescript
// In app.config.ts
if (isDevMode()) {
  validateMenuItemsConfig(menuItems, false);
}
```

---

## Dynamic Routes

### Flat Routes

Simple routes without children:

```typescript
{
  label: 'Dashboard',
  icon: 'dashboard',
  route: '/dashboard',
  component: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
}
```

Generated route:
```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  data: { label: 'Dashboard', icon: 'dashboard', class: undefined },
}
```

### Nested Routes

Routes with children (parent container + child views):

```typescript
{
  label: 'Content',
  icon: 'video_library',
  route: '/content',
  component: () => import('./pages/content/content').then((m) => m.Content),
  subItems: [
    {
      label: 'Articles',
      icon: 'article',
      route: '/articles',
      component: () => import('./pages/content/articles/articles').then((m) => m.Articles),
      subItems: [
        {
          label: 'Tech',
          icon: 'memory',
          route: '/tech',
          component: () => import('./pages/content/articles/tech/tech').then((m) => m.Tech),
        },
        // ... more sub-items
      ],
    },
    // ... more children
  ],
}
```

Generated route structure:
```
/content (parent)
├─ /articles (child)
│  ├─ /tech (grandchild)
│  ├─ /health (grandchild)
│  └─ /travel (grandchild)
├─ /videos (child)
├─ /podcasts (child)
└─ ...
```

### Special Routes

Routes without components (e.g., logout action):

```typescript
{
  label: 'Logout',
  icon: 'logout',
  class: 'logout',
  route: '/logout',
  // No component - treated as special case
}
```

The validator skips validation errors for these special routes.

---

## Route Validator

### Purpose

The route validator automatically detects configuration errors at dev-time:

- Missing required fields
- Invalid route formats
- Orphaned routes (no component, no children)
- Invalid component types
- Malformed nested structures

### Features

| Feature | Benefit |
|---------|---------|
| **Automatic validation** | Runs at app startup in dev mode |
| **Error categorization** | Errors vs warnings for severity levels |
| **Recursive validation** | Checks entire menu tree including children |
| **Helpful messages** | Clear path info and suggestions |
| **Non-blocking** | Logs to console, doesn't crash app |
| **Zero production cost** | Disabled in production builds |

### Error Types

#### 🔴 Errors (Critical)

| Error | Example | Fix |
|-------|---------|-----|
| Missing label | `{ icon: 'home', route: '/home' }` | Add `label: 'Home'` |
| Invalid route format | `{ route: 'home' }` | Use `route: '/home'` (leading `/`) |
| Invalid component type | `{ component: 'Dashboard' }` | Use `() => import(...).then(m => m.Comp)` |

#### ⚠️ Warnings (Non-Critical)

| Warning | Example | Fix |
|---------|---------|-----|
| Missing icon | `{ label: 'Home', route: '/home' }` | Add `icon: 'home'` for UI consistency |
| Orphaned route | `{ label: 'Test', route: '/test' }` | Add `component` or `subItems` |

### Console Output

Success:
```
✓ Route configuration is valid
```

With errors:
```
Route Validation Results (2 errors, 1 warning)
✗ [/menu[0]] Missing 'label' at /menu[0]
✗ [/menu[1].subItems[0]] Invalid route format 'articles' at /menu[1].subItems[0]. Routes must start with '/'
⚠ [/menu[2]] Missing 'icon' at /menu[2]
```

---

## Menu Items Configuration

### MenuItems Type Definition

Located in `src/app/models/menu-item.ts`:

```typescript
export type MenuItems = {
  label: string;                                          // Required: Display label
  icon: string;                                           // Required: Material icon name
  class?: string;                                         // Optional: CSS class (e.g., 'logout')
  route?: string;                                         // Optional: Route path (must start with /)
  subItems?: MenuItems[];                                 // Optional: Child menu items
  component?: Type<unknown> | (() => Promise<Type<unknown>>); // Optional: Component class or loader
};
```

### Complete Example

```typescript
import { MenuItems } from "./models/menu-item";

export const menuItems: MenuItems[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    component: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    label: 'Content',
    icon: 'video_library',
    route: '/content',
    component: () => import('./pages/content/content').then((m) => m.Content),
    subItems: [
      {
        label: 'Articles',
        icon: 'article',
        route: '/articles',
        component: () => import('./pages/content/articles/articles').then((m) => m.Articles),
        subItems: [
          {
            label: 'Tech',
            icon: 'memory',
            route: '/tech',
            component: () => import('./pages/content/articles/tech/tech').then((m) => m.Tech),
          },
          {
            label: 'Health',
            icon: 'health_and_safety',
            route: '/health',
            component: () => import('./pages/content/articles/health/health').then((m) => m.Health),
          },
          {
            label: 'Travel',
            icon: 'flight_takeoff',
            route: '/travel',
            component: () => import('./pages/content/articles/travel/travel').then((m) => m.Travel),
          },
        ],
      },
      {
        label: 'Videos',
        icon: 'videocam',
        route: '/videos',
        component: () => import('./pages/content/videos/videos').then((m) => m.Videos),
      },
      {
        label: 'Podcasts',
        icon: 'podcasts',
        route: '/podcasts',
        component: () => import('./pages/content/podcasts/podcasts').then((m) => m.Podcasts),
      },
      {
        label: 'Images',
        icon: 'image',
        route: '/images',
        component: () => import('./pages/content/images/images').then((m) => m.Images),
      },
      {
        label: 'Documents',
        icon: 'description',
        route: '/documents',
        component: () => import('./pages/content/documents/documents').then((m) => m.Documents),
      },
    ],
  },
  {
    label: 'Analytics',
    icon: 'analytics',
    route: '/analytics',
    component: () => import('./pages/analytics/analytics').then((m) => m.Analytics),
  },
  {
    label: 'Comments',
    icon: 'comment',
    route: '/comments',
    component: () => import('./pages/comments/comments').then((m) => m.Comments),
  },
  {
    label: 'Settings',
    icon: 'settings',
    route: '/settings',
    component: () => import('./pages/settings/settings').then((m) => m.Settings),
  },
  {
    label: 'Feedback',
    icon: 'feedback',
    route: '/feedback',
    component: () => import('./pages/feedback/feedback').then((m) => m.Feedback),
  },
  {
    label: 'Logout',
    icon: 'logout',
    class: 'logout',
    route: '/logout',
    // No component - special action route
  },
];
```

---

## Usage Examples

### Adding a New Route

1. **Generate the component:**
   ```bash
   ng g c pages/my-new-page/my-new-page
   ```

2. **Add to menu-items.ts:**
   ```typescript
   {
     label: 'My New Page',
     icon: 'star',
     route: '/my-new-page',
     component: () => import('./pages/my-new-page/my-new-page').then((m) => m.MyNewPage),
   }
   ```

3. **The route is automatically generated and validated!**

### Adding a Nested Route

1. **Generate parent and child components:**
   ```bash
   ng g c pages/products/products
   ng g c pages/products/list/product-list
   ng g c pages/products/detail/product-detail
   ```

2. **Add to menu-items.ts:**
   ```typescript
   {
     label: 'Products',
     icon: 'shopping_bag',
     route: '/products',
     component: () => import('./pages/products/products').then((m) => m.Products),
     subItems: [
       {
         label: 'List',
         icon: 'list',
         route: '/list',
         component: () => import('./pages/products/list/product-list').then((m) => m.ProductList),
       },
       {
         label: 'Detail',
         icon: 'details',
         route: '/detail',
         component: () => import('./pages/products/detail/product-detail').then((m) => m.ProductDetail),
       },
     ],
   }
   ```

### Using Route Data in Components

Access route metadata in your components:

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.html',
})
export class MyPage implements OnInit {
  pageTitle: string = '';
  pageIcon: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.pageTitle = data['label'];
      this.pageIcon = data['icon'];
    });
  }
}
```

### Manual Route Validation

Validate configuration programmatically:

```typescript
import { RouteValidator, validateMenuItemsConfig } from './utils/route-validator';
import { menuItems } from './menu-items';

// Option 1: Simple validation (logs to console)
validateMenuItemsConfig(menuItems, false);

// Option 2: Strict validation (throws on error)
try {
  validateMenuItemsConfig(menuItems, true);
} catch (error) {
  console.error('Route configuration failed validation');
}

// Option 3: Programmatic access to errors
const validator = new RouteValidator();
const errors = validator.validate(menuItems);
errors.forEach((error) => {
  console.log(`[${error.severity}] ${error.path}: ${error.message}`);
});
```

---

## Best Practices

### 1. Keep Menu Items Organized

Group related menu items together:

```typescript
// ✓ Good: Logical grouping
const contentItems: MenuItems[] = [
  { label: 'Articles', ... },
  { label: 'Videos', ... },
  { label: 'Podcasts', ... },
];

const menuItems: MenuItems[] = [
  { label: 'Dashboard', ... },
  {
    label: 'Content',
    subItems: contentItems,
    ...
  },
];

// ✗ Bad: Mixed unrelated items
const menuItems: MenuItems[] = [
  { label: 'Dashboard', ... },
  { label: 'Articles', ... },
  { label: 'Settings', ... },
  { label: 'Podcasts', ... },
];
```

### 2. Use Consistent Icon Names

Leverage Material icons consistently:

```typescript
// ✓ Good: Recognizable Material icons
icon: 'dashboard'
icon: 'article'
icon: 'videocam'
icon: 'settings'

// ✗ Bad: Non-standard icon names
icon: 'dash'
icon: 'text'
icon: 'play'
icon: 'config'
```

### 3. Always Use Route Paths with Leading Slash

Routes must start with `/`:

```typescript
// ✓ Correct
route: '/dashboard'
route: '/content'
route: '/articles'

// ✗ Incorrect (will trigger validator error)
route: 'dashboard'
route: 'content'
route: 'articles'
```

### 4. Lazy Load Components

Always use dynamic imports for components:

```typescript
// ✓ Good: Lazy loaded
component: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard)

// ✗ Bad: Eager loaded (breaks code splitting)
import { Dashboard } from './pages/dashboard/dashboard';
component: Dashboard
```

### 5. Provide Both Component and Icon

Ensure routes have meaningful icons:

```typescript
// ✓ Complete
{
  label: 'Dashboard',
  icon: 'dashboard',
  route: '/dashboard',
  component: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
}

// ⚠ Missing icon (validator warning)
{
  label: 'Dashboard',
  route: '/dashboard',
  component: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
}
```

### 6. Use Nested Routes for Hierarchy

For related functionality, nest routes:

```typescript
// ✓ Good: Logical hierarchy
{
  label: 'Content',
  route: '/content',
  subItems: [
    { label: 'Articles', route: '/articles', ... },
    { label: 'Videos', route: '/videos', ... },
  ],
}

// ⚠ Flat structure loses semantic meaning
{
  label: 'Content Articles',
  route: '/content-articles',
  ...
},
{
  label: 'Content Videos',
  route: '/content-videos',
  ...
}
```

---

## Troubleshooting

### Error: "The glob pattern import("./pages*") did not match any files [empty-glob]"

**Cause:** Dynamic path-based imports like `` import(`./pages${i.route}`) `` cannot be resolved by Webpack.

**Solution:** Use explicit component loader functions from menu items config (as implemented in this project).

```typescript
// ✗ Don't do this
loadComponent: () => import(`./pages${i.route}`).then((m) => m.Dashboard)

// ✓ Do this
loadComponent: i.component as () => Promise<Type<unknown>>
```

### Warning: "No component or children at [path]. This route will not be navigable."

**Cause:** Menu item has no `component` and no `subItems`.

**Solution:** Add a component or mark as special route:

```typescript
// Option 1: Add component
{
  label: 'My Page',
  icon: 'home',
  route: '/my-page',
  component: () => import('./pages/my-page/my-page').then((m) => m.MyPage),
}

// Option 2: Add children
{
  label: 'My Section',
  icon: 'folder',
  route: '/my-section',
  subItems: [
    // ... child items
  ],
}

// Option 3: Special action route (no validation warning)
if (route === '/logout') {
  return null; // Allowed without component
}
```

### Error: "Invalid route format '...' Routes must start with '/'"

**Cause:** Route path missing leading slash.

**Solution:** Add `/` prefix:

```typescript
// ✗ Wrong
route: 'dashboard'

// ✓ Correct
route: '/dashboard'
```

### Validator not running at startup

**Cause:** Not in development mode or validation disabled.

**Solution:** Check `isDevMode()` and ensure validation call in `app.config.ts`:

```typescript
import { isDevMode } from '@angular/core';
import { validateMenuItemsConfig } from './utils/route-validator';
import { menuItems } from './menu-items';

if (isDevMode()) {
  validateMenuItemsConfig(menuItems, false);
}
```

### Menu Items Not Appearing in Navigation

**Cause:** Menu items are duplicated between `menu-items.ts` and `custom-sidenav.ts`.

**Solution:** Ensure menu items are only defined in `menu-items.ts` and injected as input:

1. **Remove hardcoded menu items from `custom-sidenav.ts`:**
   ```typescript
   // ❌ Remove this
   protected readonly menuItems = signal<MenuItems[]>([/* ... */]);
   ```

2. **Add input setter in `custom-sidenav.ts`:**
   ```typescript
   // ✅ Add this
   @Input() set menuItems(value: MenuItems[]) {
     this._menuItems.set(value);
   }
   protected readonly items = this._menuItems.asReadonly();
   ```

3. **Import and pass menu items in `app.ts`:**
   ```typescript
   import { menuItems } from './menu-items';
   protected readonly menuItems = menuItems;
   ```

4. **Update `app.html`:**
   ```html
   <app-custom-sidenav [collapsed]="collapsed()" [menuItems]="menuItems" />
   ```

5. **Update template to use `items()` instead of `menuItems()`:**
   ```html
   @for (item of items(); track item.label) {
     <app-menu-item [item]="item" [collapsed]="sideNavCollapsed()" />
   }
   ```

---

## API Reference

### RouteValidator Class

```typescript
class RouteValidator {
  // Validates menu items and returns array of errors
  validate(menuItems: MenuItems[]): RouteValidationError[];

  // Prints validation results to console
  static printResults(errors: RouteValidationError[]): void;
}
```

### validateMenuItemsConfig Function

```typescript
function validateMenuItemsConfig(
  menuItems: MenuItems[],
  shouldThrow: boolean = false
): boolean;
```

**Parameters:**
- `menuItems`: Array of menu items to validate
- `shouldThrow`: If true, throws error on validation failure (default: false)

**Returns:**
- `true` if all checks pass or only warnings exist
- `false` if critical errors exist

### RouteValidationError Interface

```typescript
interface RouteValidationError {
  severity: 'error' | 'warn';     // Error severity level
  message: string;                 // Error description
  item?: MenuItems;                // Reference to problematic item
  path?: string;                   // Path in menu tree (e.g., "/menu[0].subItems[1]")
}
```

### itemToRoute Function

```typescript
const itemToRoute = (i: MenuItems): Route | null => {
  // Converts MenuItems to Angular Route
  // Returns null if route cannot be created
};
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/app/menu-items.ts` | Route configuration source of truth |
| `src/app/models/menu-item.ts` | MenuItems type definition |
| `src/app/app.routes.ts` | Route generation and Angular router config |
| `src/app/app.config.ts` | App initialization and validation trigger |
| `src/app/utils/route-validator.ts` | Validation utility and logic |
| `src/app/utils/route-validator.spec.ts` | Route validator tests |
| `docs/route.md` | This documentation |

---

## Summary

The dynamic routing system in this project provides:

✅ **Single source of truth** - All routes defined in `menuItems`  
✅ **Type-safe configuration** - MenuItems interface with strict typing  
✅ **Automatic generation** - Routes created from config automatically  
✅ **Built-in validation** - Catches errors at dev-time before runtime  
✅ **Lazy loading** - Components loaded on demand for performance  
✅ **Nested structure** - Support for complex hierarchical routes  
✅ **Metadata support** - Route labels, icons, classes available in components  
✅ **Zero production cost** - Validator disabled in production builds  

This architecture makes it easy to maintain, extend, and validate your application's routing structure.
