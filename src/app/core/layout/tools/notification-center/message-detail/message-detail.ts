import { Component, inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { AppNotification } from '../../../../../models/app-notification';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-message-detail',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule, DatePipe, TranslocoPipe],
  templateUrl: './message-detail.html',
  styleUrl: './message-detail.scss',
})
export class MessageDetail {
  readonly data = inject<AppNotification>(MAT_DIALOG_DATA);

  getIcon() {
    const icons = {
      support: 'support_agent',
      system: 'settings_suggest',
      feedback: 'reviews',
      feature: 'auto_awesome',
      payments: 'payments',
    };
    return icons[this.data.category] || 'notifications';
  }
}
