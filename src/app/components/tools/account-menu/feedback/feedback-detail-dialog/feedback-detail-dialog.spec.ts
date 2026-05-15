import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDetailDialog } from './feedback-detail-dialog';

describe('FeedbackDetailDialog', () => {
  let component: FeedbackDetailDialog;
  let fixture: ComponentFixture<FeedbackDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackDetailDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackDetailDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
