import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPropertiesComponent } from './order-properties.component';

describe('OrderPropertiesComponent', () => {
  let component: OrderPropertiesComponent;
  let fixture: ComponentFixture<OrderPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
