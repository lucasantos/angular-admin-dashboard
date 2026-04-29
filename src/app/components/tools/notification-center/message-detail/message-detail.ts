import { Component, inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { AppNotification } from '../../../../models/app-notification';

@Component({
  selector: 'app-message-detail',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    DatePipe
  ],
  templateUrl: './message-detail.html',
  styleUrl: './message-detail.scss',
})
export class MessageDetail {
  readonly data = inject<AppNotification>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<MessageDetail>);

  close() {
    this.dialogRef.close();
  }
}
