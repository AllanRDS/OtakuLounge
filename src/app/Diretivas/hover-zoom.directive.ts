import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverZoom]'
})
export class HoverZoomDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.applyHoverEffects();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.removeHoverEffects();
  }

  private applyHoverEffects() {
    this.renderer.setStyle(this.el.nativeElement, 'filter', 'brightness(1.1)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'filter 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 10px 20px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-6px)');
  }

  private removeHoverEffects() {
    this.renderer.setStyle(this.el.nativeElement, 'filter', 'brightness(1)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'none');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
  }
}