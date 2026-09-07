import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancePageComponent } from './finance-page.component';

describe('FinancePageComponent', () => {
  let component: FinancePageComponent;
  let fixture: ComponentFixture<FinancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancePageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
