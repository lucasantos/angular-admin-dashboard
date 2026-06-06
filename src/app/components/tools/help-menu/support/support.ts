import { Component, computed, inject, Input, signal } from '@angular/core';
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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SupportService } from '../../../../services/support.service';
import { SupportTicket } from '../../../../models/support-ticket';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule,
    QuillModule,
    MatPaginatorModule,
    TranslocoDirective
  ],
  templateUrl: './support.html',
  styleUrl: './support.scss',
})
export class Support {
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly supportService = inject(SupportService);
  readonly statusFilter = signal<'all' | 'open' | 'pending' | 'closed'>('all');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  private readonly translocoService = inject(TranslocoService);

  // Track which tab is active (0 = New Ticket, 1 = My Tickets)
  selectedTabIndex = signal(0);

  // View state signals
  selectedTicket = signal<SupportTicket | null>(null);
  tempFiles = signal<File[]>([]);

  // Angular will automatically populate this from the ?id=... query param
  @Input() set id(ticketId: string | undefined) {
    if (ticketId) {
      this.autoSelectTicket(ticketId);
    }
  }

  private autoSelectTicket(id: string) {
    const ticket = this.supportService.tickets().find((t) => t.id === id);
    if (ticket) {
      this.selectedTabIndex.set(1); // Switch to "My Tickets" tab
      this.selectedTicket.set(ticket); // Open the detail view
    }
  }

  // IMPORTANT: Clean up the URL when the user goes back to the list
  backToList() {
    this.selectedTicket.set(null);
    // This removes the ?id=... from the browser bar
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: null },
      queryParamsHandling: 'merge',
      replaceUrl: true, // Cleaner browser history
    });
  }

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
      this.snackBar.open(this.translocoService.translate('pages.support.createTicket.ticketCreated'), 'OK', { duration: 3000 });
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

  // Filter and pagination logic
  // Computed: First filter by status, then paginate
  readonly filteredTickets = computed(() => {
    const allTickets = this.supportService.tickets();
    const filter = this.statusFilter();

    // 1. Filter
    const filtered = filter === 'all' ? allTickets : allTickets.filter((t) => t.status === filter);

    // 2. Paginate
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();

    return filtered.slice(start, end);
  });

  // Total count for the paginator (based on the filtered result)
  readonly totalFilteredCount = computed(() => {
    const filter = this.statusFilter();
    return filter === 'all'
      ? this.supportService.tickets().length
      : this.supportService.tickets().filter((t) => t.status === filter).length;
  });

  handlePageEvent(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  handleFilterChange(newFilter: any) {
    this.statusFilter.set(newFilter || 'all');
    this.pageIndex.set(0); // Reset to first page when filter changes
  }
}
