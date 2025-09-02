import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyBadgeComponent } from './loyalty-badge.component';

describe('LoyaltyBadgeComponent', () => {
  let component: LoyaltyBadgeComponent;
  let fixture: ComponentFixture<LoyaltyBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyaltyBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyaltyBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
