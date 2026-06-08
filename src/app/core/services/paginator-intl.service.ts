import { effect, inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root',
})
export class PaginatorIntlService extends MatPaginatorIntl {
  private readonly languageService = inject<LanguageService>(LanguageService);

  // Define translations
  private readonly translations: any = {
    en: {
      itemsPerPage: 'Items per page:',
      next: 'Next page',
      prev: 'Previous page',
      first: 'First page',
      last: 'Last page',
      of: 'of',
    },
    es: {
      itemsPerPage: 'Items por página:',
      next: 'Siguiente',
      prev: 'Anterior',
      first: 'Primera página',
      last: 'Última página',
      of: 'de',
    },
    'pt-BR': {
      itemsPerPage: 'Itens por página:',
      next: 'Próxima página',
      prev: 'Página anterior',
      first: 'Primeira página',
      last: 'Última página',
      of: 'de',
    },
  };

  constructor() {
    super();

    // We use an effect to listen to language changes globally.
    // When languageService.language() changes, this block runs automatically.
    effect(() => {
      this.updateLabels();
    });
  }

  private updateLabels() {
    const lang = this.languageService.currentLanguage();
    const t = this.translations[lang] || this.translations['en'];

    // These properties are inherited from MatPaginatorIntl
    this.itemsPerPageLabel = t.itemsPerPage;
    this.nextPageLabel = t.next;
    this.previousPageLabel = t.prev;
    this.firstPageLabel = t.first;
    this.lastPageLabel = t.last;

    // Custom logic for the "1 - 10 of 100" label
    this.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 ${t.of} ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} – ${endIndex} ${t.of} ${length}`;
    };

    // CRITICAL: Notify the paginator components that labels have changed
    this.changes.next();
  }
}
