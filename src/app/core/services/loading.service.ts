import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly activeRequests = signal(0);

  // Signal público para os componentes consumirem
  readonly isLoading = computed(() => this.activeRequests() > 0);

  show() {
    this.activeRequests.update((v) => v + 1);
  }

  hide() {
    this.activeRequests.update((v) => Math.max(0, v - 1));
  }
}
