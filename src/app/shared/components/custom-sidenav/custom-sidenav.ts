import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MenuItems } from '../../../core/navigation/menu-item';
import { MenuItem } from "../menu-item/menu-item";
import { AuthService } from '../../../core/services/auth.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-custom-sidenav',
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    MenuItem,
    TranslocoPipe,
  ],
  templateUrl: './custom-sidenav.html',
  styleUrl: './custom-sidenav.scss',
})
export class CustomSidenav {
  protected readonly authService = inject<AuthService>(AuthService);

  collapsed = input.required<boolean>();
  menuItems = input.required<MenuItems[]>();

  protected readonly sideNavCollapsed = computed(() => this.collapsed());
  protected readonly items = computed(() => this.menuItems());

  protected readonly profilePicSize = 100;
}
