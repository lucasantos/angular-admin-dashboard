import { Component, computed, effect, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MenuItems } from '../../../core/navigation/menu-item';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-menu-item',
  imports: [MatListModule, RouterModule, MatIconModule, MatTooltipModule, TranslocoModule],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.scss',
})
export class MenuItem {
  item = input.required<MenuItems>()

  collapsed = input.required<boolean>();

  routeHistory = input('');

  level = computed(() => this.routeHistory().split('/').length - 1);

  identation = computed(() =>
    this.collapsed() ? '16px' : `${16 + this.level() * 16}px`
  );

  nestedMenuOpen = signal(false);

  toggleNested() {
    if (!this.item().subItems) {
      return;
    }
    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }

  logRoutes = effect(() => {
    console.log('Current route history:', this.routeHistory(), this.level());
  });
}
