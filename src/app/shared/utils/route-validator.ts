import { MenuItems } from '../../core/navigation/menu-item';
import { Type } from '@angular/core';

export interface RouteValidationError {
  severity: 'error' | 'warn';
  message: string;
  item?: MenuItems;
  path?: string;
}

/**
 * Validates menu items configuration for routing issues.
 * Runs at dev time to catch configuration errors early.
 */
export class RouteValidator {
  private errors: RouteValidationError[] = [];

  /**
   * Validates the entire menu items tree
   */
  validate(menuItems: MenuItems[]): RouteValidationError[] {
    this.errors = [];
    menuItems.forEach((item, index) => this.validateItem(item, `/menu[${index}]`));
    return this.errors;
  }

  /**
   * Recursively validates a menu item and its children
   */
  private validateItem(item: MenuItems, path: string): void {
    // Validate required fields
    if (!item.label) {
      this.addError('error', `Missing 'label' at ${path}`, item, path);
    }

    if (!item.icon) {
      this.addError('warn', `Missing 'icon' at ${path}`, item, path);
    }

    // Validate route format
    if (item.route && !this.isValidRoutePath(item.route)) {
      this.addError('error', `Invalid route format '${item.route}' at ${path}. Routes must start with '/'`, item, path);
    }

    // Validate component or children existence
    const hasComponent = Boolean(item.component);
    const hasChildren = Boolean(item.subItems?.length);

    if (!hasComponent && !hasChildren && item.route !== '/logout') {
      this.addError(
        'warn',
        `No component or children at ${path} with route '${item.route}'. This route will not be navigable.`,
        item,
        path
      );
    }

    // Validate component is callable or a Type
    if (item.component) {
      if (typeof item.component !== 'function' && !this.isAngularComponent(item.component)) {
        this.addError(
          'error',
          `Invalid component at ${path}. Must be a component class or a loader function.`,
          item,
          path
        );
      }
    }

    // Validate subItems recursively
    if (item.subItems && Array.isArray(item.subItems)) {
      item.subItems.forEach((subItem, index) => {
        this.validateItem(subItem, `${path}.subItems[${index}]`);
      });
    }
  }

  /**
   * Checks if route path is valid (starts with /)
   */
  private isValidRoutePath(route: string): boolean {
    return typeof route === 'string' && route.startsWith('/');
  }

  /**
   * Checks if value is an Angular component (has decorators/metadata)
   */
  private isAngularComponent(value: any): boolean {
    return (
      value &&
      typeof value === 'function' &&
      (value.ɵcmp !== undefined || // Compiled component
        value.prototype instanceof Object) // Class instance
    );
  }

  private addError(severity: 'error' | 'warn', message: string, item?: MenuItems, path?: string): void {
    this.errors.push({ severity, message, item, path });
  }

  /**
   * Prints validation results to console
   */
  static printResults(errors: RouteValidationError[]): void {
    if (errors.length === 0) {
      console.info('✓ Route configuration is valid');
      return;
    }

    const errorCount = errors.filter((e) => e.severity === 'error').length;
    const warnCount = errors.filter((e) => e.severity === 'warn').length;

    console.group(`Route Validation Results (${errorCount} error${errorCount !== 1 ? 's' : ''}, ${warnCount} warning${warnCount !== 1 ? 's' : ''})`);

    errors.forEach((error) => {
      const icon = error.severity === 'error' ? '✗' : '⚠';
      const method = error.severity === 'error' ? 'error' : 'warn';
      console[method](`${icon} ${error.path ? `[${error.path}]` : ''} ${error.message}`);
    });

    console.groupEnd();
  }
}

/**
 * Entry point validator for app initialization
 * Call this early in your app (e.g., in main.ts or app.config.ts)
 */
export function validateMenuItemsConfig(menuItems: MenuItems[], shouldThrow: boolean = false): boolean {
  const validator = new RouteValidator();
  const errors = validator.validate(menuItems);

  RouteValidator.printResults(errors);

  if (shouldThrow && errors.some((e) => e.severity === 'error')) {
    throw new Error(`Route configuration has ${errors.length} validation error(s). Check console for details.`);
  }

  return errors.every((e) => e.severity !== 'error');
}
