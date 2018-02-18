import { TestBed, inject } from '@angular/core/testing';

import { LoaApiService } from './loa-api.service';

describe('LoaApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaApiService]
    });
  });

  it('should be created', inject([LoaApiService], (service: LoaApiService) => {
    expect(service).toBeTruthy();
  }));
});
