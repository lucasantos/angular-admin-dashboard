import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  readonly notifications = signal({
    push: true,
    email: true,
    urgent: false,
  });

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-settings');
      if (saved) this.notifications.set(JSON.parse(saved));
    }

    effect(() => {
      localStorage.setItem('app-settings', JSON.stringify(this.notifications()));
    });
  }
}
