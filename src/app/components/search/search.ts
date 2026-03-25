import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  searchQuery = '';
  isFocused = signal(false);

  /**
   * Handle search form submission
   */
  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // TODO: Emit search event or call search service
    }
  }

  /**
   * Clear the search input field
   */
  clearSearch(): void {
    this.searchQuery = '';
    // Focus input after clearing (UX improvement)
    setTimeout(() => {
      const input = document.querySelector('.search-input') as HTMLInputElement;
      input?.focus();
    });
  }
}
