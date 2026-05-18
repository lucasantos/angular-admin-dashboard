import { Injectable, signal, computed, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { BreadcrumbItem } from '../models/breadcrumb';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  private readonly dynamicLabels = signal<Map<string, string>>(new Map());
  private readonly breadcrumbsSignal = signal<BreadcrumbItem[]>([]);

  setDynamicLabel(url: string, label: string) {
    this.dynamicLabels.update((map) => {
      const newMap = new Map(map);
      newMap.set(url, label);
      return newMap;
    });
  }

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

  constructor() {
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
  }

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
}
