import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  constructor(private readonly breadcrumbService: BreadcrumbService) {}

  get breadcrumbs() {
    return this.breadcrumbService.filteredBreadcrumbs;
  }
}
