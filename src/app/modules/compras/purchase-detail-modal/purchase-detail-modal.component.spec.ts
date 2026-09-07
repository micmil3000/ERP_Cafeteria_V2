import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseDetailModalComponent } from './purchase-detail-modal.component';

describe('PurchaseDetailModalComponent', () => {
  let component: PurchaseDetailModalComponent;
  let fixture: ComponentFixture<PurchaseDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseDetailModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseDetailModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
