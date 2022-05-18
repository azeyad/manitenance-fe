import { TestBed } from '@angular/core/testing';

import { OrderLookupDataService } from './order-lookup-data.service';

describe('OrderLookupDataService', () => {
  let service: OrderLookupDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderLookupDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
