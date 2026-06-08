import { inject, Injectable, signal } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private readonly swPush = inject<SwPush>(SwPush);

  // Track subscription state
  readonly isSubscribed = signal<boolean>(false);
  readonly VAPID_PUBLIC_KEY = environment.VAPID_PUBLIC_KEY;

  constructor() {
    // Check for existing subscription on load
    this.swPush.subscription.subscribe((sub) => this.isSubscribed.set(!!sub));

    // Listen for incoming clicks on notifications
    this.swPush.notificationClicks.subscribe(({ notification }) => {
      console.log('Notification clicked:', notification);
      // TO DO - Logic to navigate to the specific ticket can go here
    });
  }

  async subscribeToNotifications() {
    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      });
      this.isSubscribed.set(true);
      // Send 'sub' object to your backend via HttpClient here
      console.log('Successfully subscribed:', sub);
    } catch (err) {
      console.error('Could not subscribe to notifications', err);
    }
  }
}
