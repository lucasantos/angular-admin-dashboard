# Angular Admin Dashboard Architecture

## Overview
This repository now follows a modern, enterprise Angular structure centered on three main application layers:

- `src/app/core` — application infrastructure and app-wide services
- `src/app/shared` — reusable UI, models, utilities, and shared presentation helpers
- `src/app/features` — domain-aligned feature modules and pages

The legacy root directories `src/app/guards`, `src/app/interceptors`, `src/app/layouts`, `src/app/models`, and `src/app/pages` have been removed. The application has been reorganized for clearer ownership, better lazy-loading, and easier future scaling.

## `src/app/core`
`core` contains app-wide infrastructure, shared runtime behavior, and platform services that are consumed by features and shared UI.

### What belongs here
- Authentication and authorization logic
- Interceptors and request pipeline concerns
- Global layout shell and layout tooling
- Navigation and route configuration
- Application-level services
- SSR / translation loader helpers

### Current contents
- `core/auth` — `auth-guard.ts`, `auth-guard.spec.ts`
- `core/i18n` — Transloco loader and title strategy
- `core/interceptors` — HTTP interceptors
- `core/layout` — main app layout and reusable layout tools
- `core/navigation` — menu definitions and route data
- `core/services` — app services such as auth, settings, notification, user, and breadcrumbs

### Pattern
- Keep `core` small and stable. Only put code here if it is truly app-wide.
- Use `core` services from feature code, but avoid putting feature-specific business logic here.
- Keep `core` imports shallow from `src/app/core/...` when used by the app shell or feature entrypoints.

## `src/app/shared`
`shared` is the home for reusable pieces that are not tied to a single domain feature.

### What belongs here
- Reusable UI components
- Shared models and DTOs used across more than one feature
- Utility code and validation helpers
- Generic UI patterns and low-level building blocks

### Current contents
- `shared/components` — reusable components such as breadcrumb, sidenav, menu-item, search, and pagination
- `shared/models` — cross-feature interfaces such as user, breadcrumb item, notification, page event, and FAQ item
- `shared/ui` — shared presentation utilities and design primitives
- `shared/utils` — shared helpers like route validation

### Pattern
- Prefer feature-local models inside `features/<feature>/models` unless the type is consumed by multiple features.
- Keep shared components generic and configurable so they can be used by multiple pages.
- Avoid placing feature-specific behavior under `shared`.

## `src/app/features`
Each folder under `features` represents a logical domain area of the application.

### What belongs here
- Feature components, pages, and route entrypoints
- Feature-scoped models and view models
- Feature-specific presentation and domain logic
- Lazy-loadable feature modules or standalone routes

### Current contents
- `analytics`
- `comments`
- `content` and subdomains like articles, documents, images, podcasts, videos
- `dashboard`
- `feedback` with its own `models/feedback-entry.ts`
- `login`
- `settings`
- `support` with `models/support-ticket.ts` and `models/ticket-message.ts`
- `user` with child routes such as `user-detail` and `users`

### Pattern
- Keep each feature self-contained.
- If a feature needs its own models, place them inside `features/<feature>/models`.
- Prefer feature-driven route definitions in `core/navigation/menu-items.ts`.
- Feature folders should own their own presentation files and tests.

## Test and spec placement
- Tests live alongside the implementation when the code is feature-specific.
- `auth-guard.spec.ts` now lives in `src/app/core/auth`, next to `auth-guard.ts`, because the guard belongs to the app infrastructure layer.
- Remove duplicate or stale root-file specs once the code has moved.

## Migration outcome
The current structure is now:

- `src/app/core` for infrastructure and cross-cutting concerns
- `src/app/shared` for reusable building blocks and shared type definitions
- `src/app/features` for vertical domain areas and pages

Legacy root folders were removed to avoid duplication and reduce confusion.

## How to add new code
1. If the code is app infrastructure, add it in `src/app/core`.
2. If the code is reusable across multiple features, add it in `src/app/shared`.
3. If the code belongs to one domain or page, add it in `src/app/features/<feature>`.
4. Use `core/navigation/menu-items.ts` to wire new feature routes into the menu and lazy-loading.
5. Use feature-local `models` when the type is not shared globally.

## Naming guidelines
- Use `core` for app-wide service and behavior names.
- Use `shared` for generic components, models, and utilities.
- Use `features/<feature>` for feature-specific names and folder layout.
- Keep imports consistent and avoid deep legacy root paths.

## Notes
- The old `src/app/pages` layer is no longer part of the application structure.
- `core/auth/auth-guard.spec.ts` is now the canonical location for the auth guard test.
- The new structure supports improved scaling, clearer ownership, and better lazy-loading patterns.
