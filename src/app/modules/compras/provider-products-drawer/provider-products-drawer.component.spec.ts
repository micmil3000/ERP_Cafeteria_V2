import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderProductsDrawerComponent } from './provider-products-drawer.component';

describe('ProviderProductsDrawerComponent', () => {
  let component: ProviderProductsDrawerComponent;
  let fixture: ComponentFixture<ProviderProductsDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderProductsDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderProductsDrawerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
