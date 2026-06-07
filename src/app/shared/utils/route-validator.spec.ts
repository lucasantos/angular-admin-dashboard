import { RouteValidator, validateMenuItemsConfig } from './route-validator';
import { MenuItems } from '../../core/navigation/menu-item';

describe('RouteValidator', () => {
  let validator: RouteValidator;

  beforeEach(() => {
    validator = new RouteValidator();
  });

  describe('validate', () => {
    it('should return empty errors for valid menu items', () => {
      const menuItems: MenuItems[] = [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          route: '/dashboard',
          component: () => Promise.resolve(class {}),
        },
      ];

      const errors = validator.validate(menuItems);
      expect(errors).toEqual([]);
    });

    it('should detect missing label', () => {
      const menuItems: MenuItems[] = [
        {
          label: '',
          icon: 'dashboard',
          route: '/dashboard',
          component: () => Promise.resolve(class {}),
        },
      ];

      const errors = validator.validate(menuItems);
      expect(errors.some((e) => e.message.includes('label'))).toBe(true);
    });

    it('should warn on missing icon', () => {
      const menuItems: MenuItems[] = [
        {
          label: 'Dashboard',
          icon: '',
          route: '/dashboard',
          component: () => Promise.resolve(class {}),
        },
      ];

      const errors = validator.validate(menuItems);
      expect(errors.some((e) => e.severity === 'warn' && e.message.includes('icon'))).toBe(true);
    });

    it('should detect invalid route format', () => {
      const menuItems: MenuItems[] = [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          route: 'dashboard', // missing leading /
          component: () => Promise.resolve(class {}),
        },
      ];

      const errors = validator.validate(menuItems);
      expect(errors.some((e) => e.severity === 'error' && e.message.includes('Invalid route'))).toBe(true);
    });

    it('should warn on route without component or children', () => {
      const menuItems: MenuItems[] = [
        {
          label: 'Empty Route',
          icon: 'help',
          route: '/empty',
        },
      ];

      const errors = validator.validate(menuItems);
      expect(errors.some((e) => e.severity === 'warn' && e.message.includes('not be navigable'))).toBe(true);
    });

    it('should allow routes with children but no component', () => {
      const menuItems: MenuItems[] = [
        {
          label: 'Content',
          icon: 'folder',
          route: '/content',
          subItems: [
            {
              label: 'Articles',
              icon: 'article',
              route: '/articles',
              component: () => Promise.resolve(class {}),
            },
          ],
        },
      ];

      const errors = validator.validate(menuItems);
      expect(errors.length).toBe(0);
    });

    it('should allow special routes like logout', () => {
      const menuItems: MenuItems[] = [
        {
          label: 'Logout',
          icon: 'logout',
          route: '/logout',
        },
      ];

      const errors = validator.validate(menuItems);
      expect(errors.length).toBe(0);
    });

    it('should recursively validate subItems', () => {
      const menuItems: MenuItems[] = [
        {
          label: 'Content',
          icon: 'folder',
          route: '/content',
          component: () => Promise.resolve(class {}),
          subItems: [
            {
              label: '', // Missing label
              icon: 'article',
              route: '/articles',
              component: () => Promise.resolve(class {}),
            },
          ],
        },
      ];

      const errors = validator.validate(menuItems);
      expect(errors.some((e) => e.message.includes('label'))).toBe(true);
    });
  });

  describe('printResults', () => {
    it('should log success when no errors', () => {
      spyOn(console, 'info');
      RouteValidator.printResults([]);
      expect(console.info).toHaveBeenCalledWith('✓ Route configuration is valid');
    });

    it('should log errors and warnings', () => {
      spyOn(console, 'error');
      spyOn(console, 'warn');
      spyOn(console, 'group');
      spyOn(console, 'groupEnd');

      const errors = [
        { severity: 'error' as const, message: 'Test error', path: '/test' },
        { severity: 'warn' as const, message: 'Test warning', path: '/test' },
      ];

      RouteValidator.printResults(errors);
      expect(console.group).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('validateMenuItemsConfig', () => {
    it('should return true when config is valid', () => {
      const menuItems: MenuItems[] = [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          route: '/dashboard',
          component: () => Promise.resolve(class {}),
        },
      ];

      const result = validateMenuItemsConfig(menuItems);
      expect(result).toBe(true);
    });

    it('should throw when shouldThrow is true and there are errors', () => {
      const menuItems: MenuItems[] = [
        {
          label: '', // Invalid
          icon: 'dashboard',
          route: '/dashboard',
          component: () => Promise.resolve(class {}),
        },
      ];

      expect(() => validateMenuItemsConfig(menuItems, true)).toThrowError();
    });
  });
});
