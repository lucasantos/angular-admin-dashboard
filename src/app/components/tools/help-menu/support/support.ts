import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { QuillModule } from 'ngx-quill';
import { SupportService } from '../../../../services/support.service';
import { SupportTicket } from '../../../../models/support-ticket';

@Component({
  selector: 'app-support',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
    QuillModule,
  ],
  templateUrl: './support.html',
  styleUrl: './support.scss',
})
export class Support {
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly supportService = inject(SupportService);

  // View state signals
  selectedTicket = signal<SupportTicket | null>(null);
  tempFiles = signal<File[]>([]);

  // Forms
  ticketForm = this.fb.nonNullable.group({
    subject: ['', Validators.required],
    category: ['Technical', Validators.required],
    priority: ['medium' as const, Validators.required],
    description: ['', Validators.required], // Quill content
  });

  replyControl = this.fb.control('', Validators.required);

  onFileChange(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.tempFiles.update((current) => [...current, ...files]);
  }

  removeFile(index: number) {
    this.tempFiles.update((f) => f.filter((_, i) => i !== index));
  }

  submitTicket() {
    if (this.ticketForm.valid) {
      const fileNames = this.tempFiles().map((f) => f.name);
      this.supportService.createTicket(this.ticketForm.getRawValue(), fileNames);
      this.snackBar.open('Ticket submitted successfully!', 'OK', { duration: 3000 });
      this.ticketForm.reset({ category: 'Technical', priority: 'medium' });
      this.tempFiles.set([]);
    }
  }

  sendReply() {
    const ticket = this.selectedTicket();
    if (ticket && this.replyControl.valid) {
      this.supportService.addReply(ticket.id, this.replyControl.value!);
      this.replyControl.reset();
    }
  }
}
