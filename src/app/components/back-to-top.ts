import { Component, signal } from '@angular/core';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-back-to-top',
  imports: [Icon],
  host: { '(window:scroll)': 'onScroll()' },
  template: `<button [class.on]="show()" (click)="up()" aria-label="Back to top" [attr.tabindex]="show() ? 0 : -1"><app-icon name="arrow-up" [size]="20" /></button>`,
  styles: `
    button { position: fixed; right: 20px; bottom: 20px; z-index: 70; width: 50px; height: 50px; border-radius: 50%; border: 0;
      background: #fff; color: var(--ink); box-shadow: var(--sh-2); display: grid; place-items: center;
      opacity: 0; transform: translateY(12px); pointer-events: none; transition: opacity .3s, transform .3s var(--ease), background .2s, color .2s; }
    button.on { opacity: 1; transform: none; pointer-events: auto; }
    button:hover { background: var(--ink); color: #fff; }
  `,
})
export class BackToTop {
  protected readonly show = signal(false);
  onScroll() { this.show.set(window.scrollY > 900); }
  up() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
}
