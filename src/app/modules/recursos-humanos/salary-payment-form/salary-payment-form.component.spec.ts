import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaryPaymentFormComponent } from './salary-payment-form.component';

describe('SalaryPaymentFormComponent', () => {
  let component: SalaryPaymentFormComponent;
  let fixture: ComponentFixture<SalaryPaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryPaymentFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaryPaymentFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
