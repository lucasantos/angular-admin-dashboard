import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject<SettingsService>(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
