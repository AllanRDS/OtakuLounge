import { HoverZoomDirective } from './hover-zoom.directive';
import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('HoverZoomDirective', () => {
  let directive: HoverZoomDirective;
  let elementRefMock: ElementRef;
  let rendererMock: Renderer2;

  beforeEach(() => {
    // Criar mocks para ElementRef e Renderer2
    elementRefMock = {
      nativeElement: {
        style: {}
      }
    } as ElementRef;

    rendererMock = {
      setStyle: jasmine.createSpy('setStyle'),
      removeStyle: jasmine.createSpy('removeStyle')
    } as any;

    // Criar instância da diretiva com mocks
    directive = new HoverZoomDirective(elementRefMock, rendererMock);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should apply zoom on mouse enter', () => {
    directive.onMouseEnter();

    expect(rendererMock.setStyle).toHaveBeenCalledWith(
      elementRefMock.nativeElement,
      'transform',
      'scale(1.05)'
    );
    expect(rendererMock.setStyle).toHaveBeenCalledWith(
      elementRefMock.nativeElement,
      'transition',
      'transform 0.3s ease-in-out'
    );
  });

  it('should reset zoom on mouse leave', () => {
    directive.onMouseLeave();

    expect(rendererMock.setStyle).toHaveBeenCalledWith(
      elementRefMock.nativeElement,
      'transform',
      'scale(1)'
    );
  });
});