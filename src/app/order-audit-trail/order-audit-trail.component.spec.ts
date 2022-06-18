import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAuditTrailComponent } from './order-audit-trail.component';

describe('OrderAuditTrailComponent', () => {
  let component: OrderAuditTrailComponent;
  let fixture: ComponentFixture<OrderAuditTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderAuditTrailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAuditTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
