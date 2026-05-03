import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackService } from '../../../../services/feedback.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { FeedbackDetailDialog } from './feedback-detail-dialog/feedback-detail-dialog';
import { FeedbackEntry } from '../../../../models/feedback-entry';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
    QuillModule,
    UpperCasePipe,
  ],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
})
export class Feedback {
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  protected feedbackService = inject(FeedbackService);

  showForm = signal(false);
  currentRating = signal(0);
  hoverRating = signal(0); // For visual feedback when hovering stars

  feedbackForm = this.fb.group({
    category: ['ui_ux', Validators.required],
    section: ['General', Validators.required],
    subject: ['', [Validators.required, Validators.minLength(5)]],
    message: ['', [Validators.required, Validators.minLength(20)]],
    attachment: [''],
  });

  openDetail(entry: FeedbackEntry) {
    this.dialog.open(FeedbackDetailDialog, {
      width: '600px',
      data: entry,
    });
  }

  setRating(val: number) {
    this.currentRating.set(val);
  }

  submit() {
    if (this.feedbackForm.valid && this.currentRating() > 0) {
      this.feedbackService.submitFeedback({
        ...(this.feedbackForm.value as any),
        rating: this.currentRating(),
      });

      this.snackBar.open('Feedback submitted. Thank you!', 'OK', {
        duration: 3000,
      });
      this.resetForm();
    } else if (this.currentRating() === 0) {
      this.snackBar.open('Please provide a star rating.', 'OK', {
        duration: 3000,
      });
    }
  }

  resetForm() {
    this.feedbackForm.reset({ category: 'ui_ux', section: '' });
    this.currentRating.set(0);
    this.showForm.set(false);
  }
}
