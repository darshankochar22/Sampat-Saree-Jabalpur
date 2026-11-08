import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-toasts',
  imports: [Icon],
  template: `
    <div class="stack" role="status" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast">
          @if (t.image) { <img [src]="t.image" alt="" /> } @else { <span class="ok"><app-icon name="check" [size]="18" [stroke]="2.2" /></span> }
          <p>{{ t.text }}</p>
          @if (t.action; as a) { <button class="act" (click)="a.run(); toast.dismiss(t.id)">{{ a.label }}</button> }
          <button class="x" (click)="toast.dismiss(t.id)" aria-label="Dismiss"><app-icon name="close" [size]="16" /></button>
        </div>
      }
    </div>
  `,
  styles: `
    .stack { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 300; display: grid; gap: 10px; width: min(440px, calc(100vw - 32px)); }
    .toast { display: flex; align-items: center; gap: 14px; background: var(--ink); color: #fff; padding: 12px 12px 12px 14px; border-radius: 16px;
      box-shadow: var(--sh-3); animation: pop .4s var(--ease) both; }
    img { width: 40px; height: 52px; object-fit: cover; border-radius: 8px; }
    .ok { width: 34px; height: 34px; border-radius: 50%; background: var(--success); display: grid; place-items: center; flex: none; }
    p { margin: 0; flex: 1; font-size: 15px; font-weight: 500; line-height: 1.4; }
    .act { border: 0; background: #fff; color: var(--ink); height: 36px; padding: 0 16px; border-radius: 999px; font-weight: 700; font-size: 13.5px; }
    .x { border: 0; background: none; color: rgba(255,255,255,.7); width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; }
    .x:hover { background: rgba(255,255,255,.12); color: #fff; }
    @keyframes pop { from { opacity: 0; transform: translateY(16px) scale(.97); } to { opacity: 1; transform: none; } }
  `,
})
export class Toasts { protected readonly toast = inject(ToastService); }
