import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule, MatIconModule, MatMenuModule, TranslocoModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  private readonly breadcrumbService = inject(BreadcrumbService);
  protected readonly allBreadcrumbs = this.breadcrumbService.filteredBreadcrumbs;

  readonly MAX_VISIBLE = 4;

  readonly needsToCollapse = computed(() => this.allBreadcrumbs().length > this.MAX_VISIBLE);

  readonly firstItem = computed(() => this.allBreadcrumbs()[0]);
  readonly lastItem = computed(() => this.allBreadcrumbs()[this.allBreadcrumbs().length - 1]);

  readonly hiddenItems = computed(() => this.allBreadcrumbs().slice(1, -1));
}
