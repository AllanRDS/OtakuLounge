import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardListSelectorComponent } from './card-list-selector.component';

describe('CardListSelectorComponent', () => {
  let component: CardListSelectorComponent;
  let fixture: ComponentFixture<CardListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardListSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
