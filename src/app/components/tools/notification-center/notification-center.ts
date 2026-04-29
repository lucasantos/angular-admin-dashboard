import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppNotification } from '../../../models/app-notification';
import { MessageDetail } from './message-detail/message-detail';

@Component({
  selector: 'app-notification-center',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltip,
    MatBadgeModule,
    MatDividerModule,
    DatePipe,
  ],
  templateUrl: './notification-center.html',
  styleUrl: './notification-center.scss',
})
export class NotificationCenter {
  protected readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  handleAction(event: MouseEvent, action: () => void) {
    event.stopPropagation(); // Prevents the menu from closing when clicking internal buttons
    action();
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  remove(id: string) {
    this.notificationService.remove(id);
  }

  clearAll() {
    this.notificationService.clearAll();
  }

  openDetail(notification: AppNotification) {
    this.notificationService.markAsRead(notification.id);

    const dialogRef = this.dialog.open(MessageDetail, {
      width: '500px',
      data: notification,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'execute_action' && notification.action) {
        this.notificationService.handleAction(notification.action);
      }
    });
  }
}
