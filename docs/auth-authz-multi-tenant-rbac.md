# Authentication, Authorization, Multi-Tenant & RBAC Architecture

## 1. Tenant Discovery (Multi-Tenancy)

The `TenantService` is responsible for identifying the current tenant based on the URL. It supports:
- **Subdomain-based tenant detection:** e.g., `client1.domain.com` → tenant: `client1`
- **Path-based tenant detection:** e.g., `domain.com/client1` → tenant: `client1`
- **Query parameter fallback:** e.g., `?tenant=tenant-a` (for development)
- If no tenant is found, defaults to `'default'`.

This ensures strict data isolation per tenant throughout the session.

---

## 2. Authentication Flow

- The `AuthService` manages user authentication and session state.
- On login, it verifies credentials against the mock API and ensures the user's `tenantId` matches the detected tenant.
- If the tenant does not match, access is denied.
- Session state is persisted in `localStorage` and restored on app reload.
- JWT tokens are simulated for development.

---

## 3. HTTP Security Interceptor

- The `securityInterceptor` attaches two headers to every HTTP request:
    - `X-Tenant-ID`: The current tenant identifier (for backend data isolation).
    - `Authorization`: Bearer token if available.
- This ensures backend APIs can enforce tenant isolation and authentication.

---

## 4. Route Guards & RBAC

- The `authGuard` protects routes by:
    - Redirecting unauthenticated users to `/login`.
    - Enforcing role-based access: routes can specify required roles in their `data` property (e.g., `data: { roles: ['Admin'] }`).
    - If the user lacks the required role, they are redirected to `/dashboard`.

---

## 5. User Model & Roles

- The `User` model includes:
    - `tenantId`: For multi-tenancy.
    - `role`: One of `'Admin'`, `'Editor'`, `'User'`, `'Viewer'`.
    - Other profile fields and a simulated JWT token.
- **RBAC Levels:**
    - **Admin:** Full access within the tenant.
    - **Editor:** Can manage content, not users.
    - **User/Viewer:** Limited to viewing.

---

## 6. Login Page

- The login page uses Angular Reactive Forms.
- On successful login, users are redirected to the dashboard.
- Errors (invalid credentials, tenant mismatch) are displayed via snack bar.

---

## 7. Mock API for Development

- The mock API (`db.json`) must contain users with distinct `tenantId` values.
- Authentication only succeeds if the user's `tenantId` matches the detected tenant.

---

## 8. Extensibility

- The architecture supports adding more roles or tenant-aware features.
- All critical security logic is centralized in services, interceptors, and guards for maintainability.

---

## Example Route Configuration

```typescript
{
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['Admin'] },
    loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage)
}
```

---

## Summary

This implementation provides:
- Strong tenant isolation (multi-tenancy)
- Secure authentication and session management
- Role-based access control (RBAC)
- Centralized HTTP security enforcement
- Easy extensibility for new roles or tenants

---
