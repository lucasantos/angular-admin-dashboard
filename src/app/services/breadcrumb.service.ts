import { Injectable, signal, computed, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { BreadcrumbItem } from '../models/breadcrumb';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly router = inject(Router);

  private readonly dynamicLabels = signal<Map<string, string>>(new Map());

  // Method for components to call
  setDynamicLabel(url: string, label: string) {
    this.dynamicLabels.update((map) => {
      const newMap = new Map(map);
      newMap.set(url, label);
      return newMap;
    });
  }

  // 1. Initialize as empty to prevent stale data
  private readonly breadcrumbsSignal = signal<BreadcrumbItem[]>([]);

  // ✅ Computed signal: filter out unwanted routes + format labels
  // readonly filteredBreadcrumbs = computed(() =>
  //   this.breadcrumbsSignal()
  //     .filter((item) => !['/login', '/logout', '/error', '/404'].includes(item.url))
  //     .map((item) => ({
  //       ...item,
  //       label: item.label.replaceAll('_', ' ').toUpperCase(),
  //     })),
  // );

  // Update the computed signal to check the registry first
  readonly filteredBreadcrumbs = computed(() =>
    this.breadcrumbsSignal().map((item) => {
      const dynamicLabel = this.dynamicLabels().get(item.url);
      const finalLabel = dynamicLabel || item.label; // Registry takes priority

      return {
        ...item,
        label: finalLabel.replaceAll('_', ' ').toUpperCase(),
      };
    })
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        // 2. startWith(null) triggers the logic immediately on app load/refresh
        startWith(null),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        // 3. Always walk the tree from the global router state snapshot
        const rootSnapshot = this.router.routerState.snapshot.root;
        const breadcrumbs: BreadcrumbItem[] = [];
        this.buildBreadcrumbs(rootSnapshot, '', breadcrumbs);
        this.breadcrumbsSignal.set(breadcrumbs);
      });
  }

  private buildBreadcrumbs(
    route: any, // Using the snapshot route
    url: string = '',
    breadcrumbs: BreadcrumbItem[] = [],
  ): void {
    const children = route.children;

    if (children.length === 0) return;

    for (const child of children) {
      // Only care about the primary outlet
      if (child.outlet === 'primary') {
        // Join the URL segments for this specific level
        const routeURL: string = child.url.map((segment: any) => segment.path).join('/');

        if (routeURL !== '') {
          url += `/${routeURL}`;
        }

        const label = child.data['label'];
        const icon = child.data['icon'];

        if (label) {
          breadcrumbs.push({ label, url: url || '/', icon });
        }

        // Continue walking down the tree
        return this.buildBreadcrumbs(child, url, breadcrumbs);
      }
    }
  }
}
