import { TestBed } from '@angular/core/testing';

import { FaqService } from './faq.service';

describe('FaqService', () => {
  let service: FaqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject<FaqService>(FaqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
