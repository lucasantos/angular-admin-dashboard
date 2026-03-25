import { Injectable, signal, computed } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreadcrumbItem } from '../models/breadcrumb';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // ✅ Use a signal instead of BehaviorSubject
  private readonly breadcrumbsSignal = signal<BreadcrumbItem[]>([
    { label: 'Dashboard', url: '/dashboard', icon: 'dashboard' },
  ]);

  // Expose as readonly signal
  readonly breadcrumbs = this.breadcrumbsSignal.asReadonly();

  // ✅ Computed signal: filter out unwanted routes + format labels
  readonly filteredBreadcrumbs = computed(() =>
    this.breadcrumbs()
      .filter((item) => !['/login', '/logout', '/error', '/404'].includes(item.url))
      .map((item) => ({
        ...item,
        label: item.label.replaceAll('_', ' ').toUpperCase(),
      })),
  );

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
      this.breadcrumbsSignal.set(breadcrumbs);
    });
  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadcrumbItem[] = [],
  ): BreadcrumbItem[] {
    const ROUTE_DATA_BREADCRUMB = 'label';
    const ROUTE_DATA_ICON = 'icon';

    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      if (child.outlet !== 'primary') {
        continue;
      }

      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data[ROUTE_DATA_BREADCRUMB];
      const icon = child.snapshot.data[ROUTE_DATA_ICON];

      if (label) {
        breadcrumbs.push({ label, url, icon });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
