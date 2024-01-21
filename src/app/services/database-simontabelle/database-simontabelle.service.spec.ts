import { TestBed } from '@angular/core/testing';

import { DatabaseSimontabelleService } from './database-simontabelle.service';

describe('DatabaseSimontabelleService', () => {
  let service: DatabaseSimontabelleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseSimontabelleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
