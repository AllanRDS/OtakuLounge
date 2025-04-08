import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarroselCardsPComponent } from './carrosel-cards-p.component';

describe('CarroselCardsPComponent', () => {
  let component: CarroselCardsPComponent;
  let fixture: ComponentFixture<CarroselCardsPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarroselCardsPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarroselCardsPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
