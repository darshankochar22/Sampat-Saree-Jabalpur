import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product, findProduct, img } from '../data/products';
import { ToastService } from './toast.service';

export interface CartLine { id: string; qty: number; }

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly lines = signal<CartLine[]>(load('ss-cart', []));
  readonly wishlist = signal<string[]>(load('ss-wish', []));
  readonly drawerOpen = signal(false);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly items = computed(() =>
    this.lines()
      .map(l => ({ product: findProduct(l.id), qty: l.qty }))
      .filter((x): x is { product: Product; qty: number } => !!x.product));
  readonly count = computed(() => this.lines().reduce((n, l) => n + l.qty, 0));
  readonly subtotal = computed(() => this.items().reduce((s, i) => s + i.product.price * i.qty, 0));
  readonly savings = computed(() => this.items().reduce((s, i) => s + (i.product.mrp - i.product.price) * i.qty, 0));
  readonly shipping = computed(() => (this.subtotal() >= 2999 || this.subtotal() === 0 ? 0 : 99));
  readonly total = computed(() => this.subtotal() + this.shipping());

  constructor() {
    effect(() => save('ss-cart', this.lines()));
    effect(() => save('ss-wish', this.wishlist()));
  }

  add(id: string, qty = 1) {
    this.lines.update(ls => {
      const found = ls.find(l => l.id === id);
      return found ? ls.map(l => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...ls, { id, qty }];
    });
    this.drawerOpen.set(true);
  }
  setQty(id: string, qty: number) {
    if (qty <= 0) return this.remove(id);
    this.lines.update(ls => ls.map(l => (l.id === id ? { ...l, qty } : l)));
  }
  remove(id: string) {
    const prev = this.lines();
    this.lines.update(ls => ls.filter(l => l.id !== id));
    this.toast.show('Removed from bag', { action: { label: 'Undo', run: () => this.lines.set(prev) } });
  }
  clear() { this.lines.set([]); }

  isWished(id: string) { return this.wishlist().includes(id); }
  toggleWish(id: string) {
    const adding = !this.isWished(id);
    this.wishlist.update(w => (adding ? [...w, id] : w.filter(x => x !== id)));
    const p = findProduct(id);
    this.toast.show(adding ? 'Saved to your wishlist' : 'Removed from wishlist', {
      image: p ? img(p.images[0], 120) : undefined,
      action: adding ? { label: 'View', run: () => this.router.navigateByUrl('/wishlist') } : undefined,
    });
  }
}
