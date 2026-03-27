import { Route, Routes } from '@angular/router';
import { Type } from '@angular/core';
import { MenuItems } from './models/menu-item';
import { menuItems } from './menu-items';

const itemToRoute = (i: MenuItems): Route | null => {
  const path = i.route ? i.route.replace(/^\//, '') : '';

  if (!i.component && !i.subItems) {
    // Skip routes that only exist in menu (e.g., logout-outline action entry)
    return null;
  }

  const route: Route = {
    path,
    data: {
      label: i.label,
      icon: i.icon,
      class: i.class,
    },
    resolve: i.resolve,
  };

  if (i.component) {
    // Check if it's a lazy-loading function:
    // It's a function AND it's not a class (classes start with the 'class' keyword in string form)
    const isLazyLoader =
      typeof i.component === 'function' && !i.component.toString().startsWith('class');

    if (isLazyLoader) {
      route.loadComponent = i.component as () => Promise<Type<unknown>>;
    } else {
      // It's a direct Component Class (like UserShell)
      route.component = i.component as Type<unknown>;
    }
  }

  if (i.subItems) {
    const children = i.subItems.map((s) => itemToRoute(s)).filter(Boolean) as Route[];
    if (children.length) {
      route.children = children;
    }
  }

  return route;
};


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  ...menuItems
    .map((i) => itemToRoute(i))
    .filter((r): r is Route => r !== null),
];
