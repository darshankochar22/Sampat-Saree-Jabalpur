import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { img } from '../data/products';
import { InrPipe } from '../components/inr.pipe';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, InrPipe, Icon],
  template: `
    <section class="container page">
      <header class="ph">
        <h1>Your bag</h1>
        @if (cart.count()) { <p>{{ cart.count() }} {{ cart.count() === 1 ? 'item' : 'items' }}</p> }
      </header>

      @if (cart.items().length) {
        <div class="layout">
          <div class="lines">
            @for (i of cart.items(); track i.product.id) {
              <article class="line">
                <a [routerLink]="['/product', i.product.id]" class="thumb"><img [src]="img(i.product.images[0], 300)" [alt]="i.product.name" /></a>
                <div class="meta">
                  <p class="fabric">{{ i.product.fabric }}</p>
                  <a class="name" [routerLink]="['/product', i.product.id]">{{ i.product.name }}</a>
                  <p class="unit">{{ i.product.price | inr }} each</p>
                  <div class="actions">
                    <div class="qty" role="group" aria-label="Quantity">
                      <button (click)="cart.setQty(i.product.id, i.qty - 1)" aria-label="Decrease"><app-icon name="minus" [size]="16" /></button>
                      <span>{{ i.qty }}</span>
                      <button (click)="cart.setQty(i.product.id, i.qty + 1)" aria-label="Increase"><app-icon name="plus" [size]="16" /></button>
                    </div>
                    <button class="rm" (click)="cart.remove(i.product.id)"><app-icon name="trash" [size]="18" /> Remove</button>
                  </div>
                </div>
                <strong class="amt">{{ i.product.price * i.qty | inr }}</strong>
              </article>
            }
            <a class="text-link back" routerLink="/shop"><app-icon name="arrow" [size]="16" class="flip" /> Continue shopping</a>
          </div>

          <aside class="summary">
            <h2>Order summary</h2>
            <div class="r"><span>Subtotal</span><span>{{ cart.subtotal() | inr }}</span></div>
            @if (cart.savings() > 0) { <div class="r save"><span>Discount on MRP</span><span>−{{ cart.savings() | inr }}</span></div> }
            <div class="r"><span>Shipping</span><span>{{ cart.shipping() ? (cart.shipping() | inr) : 'Free' }}</span></div>
            <div class="r total"><span>Total</span><span>{{ cart.total() | inr }}</span></div>
            <a class="btn btn-primary btn-lg btn-block" routerLink="/checkout">Checkout securely <app-icon name="arrow" class="arrow" /></a>
            <ul class="assure">
              <li><app-icon name="cash" [size]="18" /> Cash on delivery available</li>
              <li><app-icon name="refresh" [size]="18" /> Easy 7-day exchange</li>
            </ul>
          </aside>
        </div>
      } @else {
        <div class="empty">
          <div class="circle"><app-icon name="bag" [size]="36" [stroke]="1.3" /></div>
          <h2>Your bag is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <a class="btn btn-primary" routerLink="/shop">Start shopping <app-icon name="arrow" class="arrow" /></a>
        </div>
      }
    </section>
  `,
  styles: `
    .page { padding-top: 56px; padding-bottom: 112px; }
    .ph { display: flex; align-items: baseline; gap: 16px; margin-bottom: 40px; }
    .ph h1 { font-size: clamp(40px, 5vw, 60px); }
    .ph p { margin: 0; color: var(--ink-soft); font-weight: 600; }
    .layout { display: grid; grid-template-columns: 1fr 400px; gap: 56px; align-items: start; }
    .line { display: grid; grid-template-columns: 120px 1fr auto; gap: 24px; padding: 24px 0; border-bottom: 1px solid var(--line); }
    .line:first-child { border-top: 1px solid var(--line); }
    .thumb img { width: 120px; height: 160px; object-fit: cover; border-radius: var(--r-md); }
    .fabric { margin: 0; font-size: 13.5px; font-weight: 700; color: var(--gold); }
    .name { display: block; font-family: var(--serif); font-size: 22px; line-height: 1.25; margin: 4px 0 6px; }
    .name:hover { color: var(--accent); }
    .unit { margin: 0 0 16px; color: var(--ink-soft); font-size: 15px; }
    .actions { display: flex; align-items: center; gap: 16px; }
    .qty { display: inline-flex; align-items: center; border: 1.5px solid var(--line-strong); border-radius: 999px; height: 44px; }
    .qty button { width: 42px; height: 100%; border: 0; background: none; display: grid; place-items: center; border-radius: 999px; }
    .qty button:hover { background: var(--bg-tint); }
    .qty span { min-width: 26px; text-align: center; font-weight: 700; }
    .rm { display: inline-flex; align-items: center; gap: 6px; border: 0; background: none; color: var(--ink-soft); font-weight: 600; font-size: 14.5px; padding: 8px 10px; border-radius: 999px; }
    .rm:hover { color: var(--accent); background: var(--accent-soft); }
    .amt { font-size: 18px; font-weight: 700; }
    .back { margin-top: 28px; }
    .flip { transform: rotate(180deg); }
    .summary { background: var(--bg-soft); padding: 32px; border-radius: var(--r-lg); display: grid; gap: 14px; position: sticky; top: 96px; }
    .summary h2 { font-size: 26px; margin-bottom: 6px; }
    .r { display: flex; justify-content: space-between; font-size: 16px; color: var(--ink-2); }
    .save { color: var(--success); font-weight: 600; }
    .total { border-top: 1px solid var(--line-strong); padding-top: 16px; margin-top: 4px; font-size: 20px; font-weight: 700; color: var(--ink); }
    .summary .btn { margin-top: 8px; }
    .assure { list-style: none; padding: 0; margin: 6px 0 0; display: grid; gap: 8px; font-size: 14.5px; color: var(--ink-soft); }
    .assure li { display: flex; align-items: center; gap: 10px; }
    .assure app-icon { color: var(--accent); }
    .empty { text-align: center; padding: 48px 0; display: grid; justify-items: center; }
    .circle { width: 96px; height: 96px; border-radius: 50%; background: var(--bg-soft); display: grid; place-items: center; color: var(--accent); margin-bottom: 18px; }
    .empty h2 { font-size: 32px; }
    .empty p { color: var(--ink-soft); margin: 10px 0 26px; }
    @media (max-width: 960px) {
      .layout { grid-template-columns: 1fr; gap: 40px; }
      .summary { position: static; }
    }
    @media (max-width: 560px) {
      .page { padding-top: 32px; }
      .line { grid-template-columns: 92px 1fr; gap: 16px; }
      .thumb img { width: 92px; height: 124px; }
      .amt { grid-column: 2; }
      .name { font-size: 19px; }
      .actions { gap: 8px; }
      .summary { padding: 24px 20px; }
    }
  `,
})
export class CartPage {
  protected readonly cart = inject(CartService);
  protected readonly img = img;
}
