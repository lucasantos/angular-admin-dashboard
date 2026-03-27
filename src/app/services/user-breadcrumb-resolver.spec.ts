import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userBreadcrumbResolver } from './user-breadcrumb-resolver';

describe('userBreadcrumbResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => userBreadcrumbResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
