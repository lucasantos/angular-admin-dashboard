import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '../../../models/page-event';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-pagination',
  imports: [MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatTooltip, MatDivider],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Pagination {
  @Input({ required: true }) length = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions = [5, 10, 25, 50];

  @Output() page = new EventEmitter<PageEvent>();

  get totalPages(): number {
    return Math.ceil(this.length / this.pageSize);
  }

  get rangeLabel(): string {
    if (this.length === 0) return '0 of 0';
    const start = this.pageIndex * this.pageSize + 1;
    const end = Math.min((this.pageIndex + 1) * this.pageSize, this.length);
    return `${start} – ${end} of ${this.length}`;
  }

  changePage(index: number) {
    if (index >= 0 && index < this.totalPages) {
      this.pageIndex = index;
      this.emitChange();
    }
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.pageIndex = 0; // Reset to first page when size changes
    this.emitChange();
  }

  private emitChange() {
    this.page.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
  }
}
