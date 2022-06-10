import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseOrderComponent } from './release-order.component';

describe('ReleaseOrderComponent', () => {
  let component: ReleaseOrderComponent;
  let fixture: ComponentFixture<ReleaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
