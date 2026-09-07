import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesPageComponent } from './sales-page.component';

describe('SalesPageComponent', () => {
  let component: SalesPageComponent;
  let fixture: ComponentFixture<SalesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
