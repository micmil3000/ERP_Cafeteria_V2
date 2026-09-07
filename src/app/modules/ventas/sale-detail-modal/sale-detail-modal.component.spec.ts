import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleDetailModalComponent } from './sale-detail-modal.component';

describe('SaleDetailModalComponent', () => {
  let component: SaleDetailModalComponent;
  let fixture: ComponentFixture<SaleDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleDetailModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaleDetailModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
