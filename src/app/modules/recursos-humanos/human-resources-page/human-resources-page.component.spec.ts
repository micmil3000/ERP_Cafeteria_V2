import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HumanResourcesPageComponent } from './human-resources-page.component';

describe('HumanResourcesPageComponent', () => {
  let component: HumanResourcesPageComponent;
  let fixture: ComponentFixture<HumanResourcesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanResourcesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HumanResourcesPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
