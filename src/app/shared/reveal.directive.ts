import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

let io: IntersectionObserver | null = null;
function observer() {
  if (!io && typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io!.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  }
  return io;
}

/** Fades + lifts an element in the first time it scrolls into view. */
@Directive({ selector: '[reveal]', host: { class: 'reveal', '[style.--d]': 'delay() + "ms"' } })
export class Reveal implements OnInit, OnDestroy {
  readonly delay = input(0, { alias: 'reveal', transform: (v: unknown) => Number(v) || 0 });
  private readonly el = inject(ElementRef<HTMLElement>);
  ngOnInit() {
    const o = observer();
    o ? o.observe(this.el.nativeElement) : this.el.nativeElement.classList.add('in');
  }
  ngOnDestroy() { observer()?.unobserve(this.el.nativeElement); }
}
