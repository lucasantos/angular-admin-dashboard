import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../features/user/services/user.service';
import { map, of } from 'rxjs';

export const userBreadcrumbResolver: ResolveFn<string> = (route) => {
  const userService = inject<UserService>(UserService);
  const userId = route.paramMap.get('id');

  if (!userId) return of('messages.unknownUser');

  return userService.getUserById(userId).pipe(
    map((user) => (user ? user.name : 'messages.userNotFound')),
  );
};
