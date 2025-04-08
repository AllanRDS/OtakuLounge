import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransicaoComponent } from './transicao.component';

describe('TransicaoComponent', () => {
  let component: TransicaoComponent;
  let fixture: ComponentFixture<TransicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransicaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
