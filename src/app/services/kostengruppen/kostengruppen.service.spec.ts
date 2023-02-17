import { TestBed } from '@angular/core/testing';

import { KostengruppenService } from './kostengruppen.service';

describe('KostengruppenService', () => {
  let service: KostengruppenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KostengruppenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
