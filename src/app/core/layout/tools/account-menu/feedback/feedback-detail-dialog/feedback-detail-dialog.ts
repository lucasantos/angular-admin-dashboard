import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackEntry } from '../../../../../../models/feedback-entry';
import { MatDivider } from "@angular/material/divider";
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-feedback-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, DatePipe, MatDivider, TranslocoPipe],
  templateUrl: './feedback-detail-dialog.html',
  styleUrl: './feedback-detail-dialog.scss',
})
export class FeedbackDetailDialog {
  data = inject<FeedbackEntry>(MAT_DIALOG_DATA);
}
