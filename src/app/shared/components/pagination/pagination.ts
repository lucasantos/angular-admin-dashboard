import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '../../models/page-event';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatPaginatorModule, MatDividerModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  @Input({ required: true }) length = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions = [5, 10, 25, 50];

  @Output() page = new EventEmitter<PageEvent>();
}
