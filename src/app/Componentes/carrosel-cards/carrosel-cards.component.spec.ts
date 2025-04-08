import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarroselCardsComponent } from './carrosel-cards.component';

describe('CarroselCardsComponent', () => {
  let component: CarroselCardsComponent;
  let fixture: ComponentFixture<CarroselCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarroselCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarroselCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
