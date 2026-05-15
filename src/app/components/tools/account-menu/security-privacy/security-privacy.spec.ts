import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityPrivacy } from './security-privacy';

describe('SecurityPrivacy', () => {
  let component: SecurityPrivacy;
  let fixture: ComponentFixture<SecurityPrivacy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityPrivacy],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityPrivacy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
