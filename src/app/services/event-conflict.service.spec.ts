import { TestBed } from '@angular/core/testing';

import { EventConflictService } from './event-conflict.service';

describe('EventConflictService', () => {
  let service: EventConflictService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventConflictService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
