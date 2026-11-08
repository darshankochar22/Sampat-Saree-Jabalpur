import { Directive, ElementRef, inject, AfterViewInit } from '@angular/core';

/** Adds `.loaded` once the image has decoded, for a soft fade-in. */
@Directive({ selector: 'img[fade]', host: { class: 'fade', '(load)': 'done()', '(error)': 'done()' } })
export class ImgFade implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLImageElement>);
  ngAfterViewInit() { if (this.el.nativeElement.complete) this.done(); }
  done() { this.el.nativeElement.classList.add('loaded'); }
}
