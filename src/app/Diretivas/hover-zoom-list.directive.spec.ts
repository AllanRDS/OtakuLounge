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

  it('should apply zoom on mouse enter and change opacity if screen is md or larger', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(800); // Simula uma tela maior que md

    directive.onMouseEnter();

    expect(rendererMock.setStyle).toHaveBeenCalledWith(
      elementRefMock.nativeElement,
      'transform',
      'scale(1.05)'
    );
    expect(rendererMock.setStyle).toHaveBeenCalledWith(
      elementRefMock.nativeElement.querySelector('.card-content'),
      'opacity',
      '1'
    );
  });

  it('should not change opacity on mouse enter if screen is smaller than md', () => {
    spyOnProperty(window, 'innerWidth').and .returnValue(500); // Simula uma tela menor que md

    directive.onMouseEnter();

    expect(rendererMock.setStyle).toHaveBeenCalledWith(
      elementRefMock.nativeElement,
      'transform',
      'scale(1.05)'
    );
    expect(rendererMock.setStyle).not.toHaveBeenCalledWith(
      elementRefMock.nativeElement.querySelector('.card-content'),
      'opacity',
      '1'
    );
  });

  it('should reset zoom on mouse leave and change opacity if screen is md or larger', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(800); // Simula uma tela maior que md

    directive.onMouseLeave();

    expect(rendererMock.setStyle).toHaveBeenCalledWith(
      elementRefMock.nativeElement,
      'transform',
      'scale(1)'
    );
    expect(rendererMock.setStyle).toHaveBeenCalledWith(
      elementRefMock.nativeElement.querySelector('.card-content'),
      'opacity',
      '0'
    );
  });

  it('should not change opacity on mouse leave if screen is smaller than md', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(500); // Simula uma tela menor que md

    directive.onMouseLeave();

    expect(rendererMock.setStyle).toHaveBeenCalledWith(
      elementRefMock.nativeElement,
      'transform',
      'scale(1)'
    );
    expect(rendererMock.setStyle).not.toHaveBeenCalledWith(
      elementRefMock.nativeElement.querySelector('.card-content'),
      'opacity',
      '0'
    );
  });
});