import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

export interface BreadcrumbItem {
  label: string;
  url: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>([
    { label: 'Dashboard', url: '/dashboard', icon: 'dashboard' },
  ]);

  breadcrumbs$: Observable<BreadcrumbItem[]> = this.breadcrumbsSubject.asObservable().pipe(
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
        this.breadcrumbsSubject.next(breadcrumbs);
      });
  }

  /**
   * Build breadcrumb trail by traversing the activated route tree
   */
  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadcrumbItem[] = []
  ): BreadcrumbItem[] {
    const ROUTE_DATA_BREADCRUMB = 'label';
    const ROUTE_DATA_ICON = 'icon';

    // Get the child routes
    const children: ActivatedRoute[] = route.children;

    // Return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    // Iterate over child routes
    for (const child of children) {
      // Verify primary route
      if (child.outlet !== 'primary') {
        continue;
      }

      // Get the route URL segment
      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');

      // Append route URL to URL
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Only add breadcrumb if data.label exists
      const label = child.snapshot.data[ROUTE_DATA_BREADCRUMB];
      const icon = child.snapshot.data[ROUTE_DATA_ICON];

      if (label) {
        const breadcrumb: BreadcrumbItem = {
          label,
          url,
          icon,
        };
        breadcrumbs.push(breadcrumb);
      }

      // Recursive
      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
