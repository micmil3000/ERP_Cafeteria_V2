import { ComponentFixture, TestBed } from '@angular/core/testing';
import { inventoryPageComponent } from './inventory-page.component';

describe('inventoryPageComponent', () => {
  let component: inventoryPageComponent;
  let fixture: ComponentFixture<inventoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [inventoryPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(inventoryPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
