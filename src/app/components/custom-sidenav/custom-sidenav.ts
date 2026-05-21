import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MenuItems } from '../../models/menu-item';
import { MenuItem } from "../menu-item/menu-item";
import { AuthService } from '../../services/auth.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-custom-sidenav',
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MatTooltipModule, MenuItem, TranslocoPipe],
  templateUrl: './custom-sidenav.html',
  styleUrl: './custom-sidenav.scss',
})
export class CustomSidenav {
  protected readonly authService = inject(AuthService);
  sideNavCollapsed = signal(false);

  @Input() set collapsed(value: boolean) {
    this.sideNavCollapsed.set(value);
  }

  @Input() set menuItems(value: MenuItems[]) {
    this._menuItems.set(value);
  }

  private readonly _menuItems = signal<MenuItems[]>([]);

  // Expose menu items as readonly signal for template
  protected readonly items = this._menuItems.asReadonly();

  profilePicSize = computed(() => (this.sideNavCollapsed() ? '50' : '100'));
}
