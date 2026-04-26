import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FaqService } from '../../services/faq.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faq',
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  private readonly faqService = inject(FaqService);

  // Search state
  searchQuery = signal('');

  // Filtered FAQs computed automatically when data or search changes
  filteredFaqs = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.faqService.faqs().filter(f => 
      f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)
    );
  });
}
