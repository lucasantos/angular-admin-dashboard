import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '../../../models/page-event';
import { MatDivider } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  imports: [MatPaginatorModule, MatDivider],
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
