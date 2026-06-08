import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FaqService } from '../../../../../features/support/services/faq.service';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-faq',
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, TranslocoDirective],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  private readonly faqService = inject<FaqService>(FaqService);

  searchQuery = signal('');

  // Filtered FAQs computed automatically when data or search changes
  filteredFaqs = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.faqService.faqs().filter(f =>
      f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)
    );
  });
}
