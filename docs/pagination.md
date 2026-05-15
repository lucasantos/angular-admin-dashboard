# Pagination Component Documentation

## Overview

The `Pagination` component is a reusable Angular component that provides a consistent and easy-to-use pagination interface for any list or table in your application. It is built on top of Angular Material's paginator and is styled to match the application's design system.

---

## Features
- Simple integration with any component displaying paginated data
- Customizable page size and options
- Emits page change events for parent component handling
- Styled for seamless UI integration

---

## Component API

### Selector
```html
<app-pagination></app-pagination>
```

### Inputs
| Name            | Type     | Required | Default         | Description                                 |
|-----------------|----------|----------|-----------------|---------------------------------------------|
| `length`        | number   | Yes      | —               | Total number of items in the list           |
| `pageSize`      | number   | No       | 10              | Number of items per page                    |
| `pageIndex`     | number   | No       | 0               | Current page index (zero-based)             |
| `pageSizeOptions` | number[] | No      | [5, 10, 25, 50] | Array of selectable page sizes              |

### Outputs
| Name   | Type      | Description                                 |
|--------|-----------|---------------------------------------------|
| `page` | PageEvent | Emits when the user changes the page or page size |

---

## Usage Example

### 1. Import the Component
Ensure `Pagination` is imported in your feature module or component:

```typescript
import { Pagination } from 'src/app/components/shared/pagination/pagination';
```

Add it to your `imports` array if using standalone components, or to your module's `declarations` if using NgModules.

### 2. Add to Template
Place the component where you want pagination controls to appear:

```html
<app-pagination
  [length]="totalItems"
  [pageSize]="pageSize"
  [pageIndex]="pageIndex"
  (page)="onPageEvent($event)"
>
</app-pagination>
```

### 3. Handle Pagination in Your Component
Maintain state for `pageSize` and `pageIndex`, and update your data slice when the page changes:

```typescript
import { PageEvent } from 'src/app/models/page-event';

// ...
pageSize = 10;
pageIndex = 0;
totalItems = 100; // Set this to your data length

onPageEvent(event: PageEvent) {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
  // Fetch or slice your data accordingly
}
```

### 4. Example: Feedback Component Integration
In the Feedback component, pagination is used to display a paginated list of feedback entries:

```html
<app-pagination
  [length]="feedbackService.feedbackHistory().length"
  [pageSize]="pageSize()"
  [pageIndex]="pageIndex()"
  (page)="handlePageEvent($event)"
>
</app-pagination>
```

The component manages `pageSize` and `pageIndex` as signals, and slices the feedback list accordingly:

```typescript
paginatedFeedback = computed(() => {
  const all = this.feedbackService.feedbackHistory();
  const start = this.pageIndex() * this.pageSize();
  const end = start + this.pageSize();
  return all.slice(start, end);
});

handlePageEvent(e: PageEvent) {
  this.pageIndex.set(e.pageIndex);
  this.pageSize.set(e.pageSize);
}
```

---

## Styling
The component comes with default styles for a modern look. You can override or extend these styles in your global or component stylesheets as needed.

---

## Customization
- You can change the `pageSizeOptions` to fit your use case.
- The component emits standard Angular Material `PageEvent` objects, so it integrates seamlessly with any data source.

---

## File Locations
- Component: `src/app/components/shared/pagination/pagination.ts`
- Template: `src/app/components/shared/pagination/pagination.html`
- Styles: `src/app/components/shared/pagination/pagination.scss`

---

## Summary
The `Pagination` component is a plug-and-play solution for adding pagination to any list or table in your Angular application. Follow the usage example to quickly integrate it into your own components.
