import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import { map, of } from 'rxjs';

export const userBreadcrumbResolver: ResolveFn<string> = (route) => {
  const userService = inject(UserService);
  const userId = route.paramMap.get('id');

  if (!userId) return of('Unknown User');

  return userService.getUserById(userId).pipe(
    // We only want the name for the breadcrumb label
    map((user) => (user ? user.name : 'User Not Found')),
  );
};
