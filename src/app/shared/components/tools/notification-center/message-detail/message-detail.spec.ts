import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDetail } from './message-detail';

describe('MessageDetail', () => {
  let component: MessageDetail;
  let fixture: ComponentFixture<MessageDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
