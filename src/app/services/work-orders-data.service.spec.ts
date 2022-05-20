import { TestBed } from '@angular/core/testing';

import { WorkOrdersDataService } from './work-orders-data.service';

describe('WorkOrdersDataService', () => {
  let service: WorkOrdersDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrdersDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
