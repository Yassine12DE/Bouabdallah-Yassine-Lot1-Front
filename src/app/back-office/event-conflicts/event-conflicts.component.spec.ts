import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventConflictsComponent } from './event-conflicts.component';

describe('EventConflictsComponent', () => {
  let component: EventConflictsComponent;
  let fixture: ComponentFixture<EventConflictsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventConflictsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventConflictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
