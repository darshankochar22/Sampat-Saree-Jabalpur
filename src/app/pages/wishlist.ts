import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product-card';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, ProductCard, Icon],
  template: `
    <section class="container page">
      <header class="ph">
        <h1>Wishlist</h1>
        @if (items().length) { <p>{{ items().length }} saved {{ items().length === 1 ? 'piece' : 'pieces' }}</p> }
      </header>
      @if (items().length) {
        <div class="grid">@for (p of items(); track p.id) { <app-product-card [product]="p" /> }</div>
      } @else {
        <div class="empty">
          <div class="circle"><app-icon name="heart" [size]="36" [stroke]="1.3" /></div>
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any piece to keep it here for later.</p>
          <a class="btn btn-primary" routerLink="/shop">Explore the collection <app-icon name="arrow" class="arrow" /></a>
        </div>
      }
    </section>
  `,
  styles: `
    .page { padding-top: 56px; padding-bottom: 112px; }
    .ph { display: flex; align-items: baseline; gap: 16px; margin-bottom: 40px; }
    .ph h1 { font-size: clamp(40px, 5vw, 60px); }
    .ph p { margin: 0; color: var(--ink-soft); font-weight: 600; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 44px 24px; }
    .empty { text-align: center; padding: 40px 0; display: grid; justify-items: center; }
    .circle { width: 96px; height: 96px; border-radius: 50%; background: var(--accent-soft); display: grid; place-items: center; color: var(--accent); margin-bottom: 18px; }
    .empty h2 { font-size: 32px; }
    .empty p { color: var(--ink-soft); margin: 10px 0 26px; }
    @media (max-width: 1000px) { .grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 760px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 32px 14px; } .page { padding-top: 32px; } }
  `,
})
export class Wishlist {
  private readonly cart = inject(CartService);
  protected readonly items = computed(() => PRODUCTS.filter(p => this.cart.wishlist().includes(p.id)));
}
