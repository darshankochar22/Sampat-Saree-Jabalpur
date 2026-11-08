import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; text: string; image?: string; action?: { label: string; run: () => void }; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private seq = 0;

  show(text: string, opts: Omit<Toast, 'id' | 'text'> = {}) {
    const t: Toast = { id: ++this.seq, text, ...opts };
    this.toasts.update(ts => [...ts.slice(-2), t]);
    setTimeout(() => this.dismiss(t.id), 3800);
  }
  dismiss(id: number) { this.toasts.update(ts => ts.filter(t => t.id !== id)); }
}
