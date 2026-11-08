import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { img } from '../data/products';
import { InrPipe } from './inr.pipe';
import { Icon } from '../shared/icon';

const FREE_AT = 2999;

@Component({
  selector: 'app-cart-drawer',
  imports: [RouterLink, InrPipe, Icon],
  host: { '(document:keydown.escape)': 'close()' },
  template: `
    <div class="scrim" [class.open]="cart.drawerOpen()" (click)="close()"></div>
    <aside [class.open]="cart.drawerOpen()" role="dialog" aria-label="Shopping bag" [attr.aria-hidden]="!cart.drawerOpen()">
      <div class="head">
        <h2>Your bag <span>{{ cart.count() }} {{ cart.count() === 1 ? 'item' : 'items' }}</span></h2>
        <button class="icon-btn" (click)="close()" aria-label="Close bag"><app-icon name="close" /></button>
      </div>

      @if (cart.items().length) {
        <div class="ship">
          @if (cart.subtotal() < FREE_AT) {
            <p>You're <strong>{{ FREE_AT - cart.subtotal() | inr }}</strong> away from free shipping</p>
          } @else {
            <p class="ok"><app-icon name="truck" [size]="18" /> You've unlocked <strong>free shipping</strong></p>
          }
          <div class="bar"><i [style.width.%]="progress()"></i></div>
        </div>

        <ul>
          @for (i of cart.items(); track i.product.id) {
            <li>
              <a [routerLink]="['/product', i.product.id]" (click)="close()" class="thumb">
                <img [src]="img(i.product.images[0], 220)" [alt]="i.product.name" />
              </a>
              <div class="meta">
                <div class="top">
                  <a [routerLink]="['/product', i.product.id]" (click)="close()">{{ i.product.name }}</a>
                  <button class="rm" (click)="cart.remove(i.product.id)" [attr.aria-label]="'Remove ' + i.product.name"><app-icon name="trash" [size]="18" /></button>
                </div>
                <p>{{ i.product.fabric }}</p>
                <div class="row">
                  <div class="qty" role="group" aria-label="Quantity">
                    <button (click)="cart.setQty(i.product.id, i.qty - 1)" aria-label="Decrease"><app-icon name="minus" [size]="16" /></button>
                    <span>{{ i.qty }}</span>
                    <button (click)="cart.setQty(i.product.id, i.qty + 1)" aria-label="Increase"><app-icon name="plus" [size]="16" /></button>
                  </div>
                  <strong>{{ i.product.price * i.qty | inr }}</strong>
                </div>
              </div>
            </li>
          }
        </ul>

        <div class="foot">
          @if (cart.savings() > 0) { <p class="save">You're saving {{ cart.savings() | inr }} on this order</p> }
          <div class="sum"><span>Subtotal</span><strong>{{ cart.subtotal() | inr }}</strong></div>
          <p class="note">Taxes included. Shipping calculated at checkout.</p>
          <a class="btn btn-primary btn-block btn-lg" routerLink="/checkout" (click)="close()">
            Checkout <app-icon name="arrow" class="arrow" [size]="18" />
          </a>
          <a class="text-link" routerLink="/cart" (click)="close()">View full bag</a>
        </div>
      } @else {
        <div class="empty">
          <div class="circle"><app-icon name="bag" [size]="34" [stroke]="1.3" /></div>
          <h3>Your bag is empty</h3>
          <p>Discover sarees, suits and lehengas chosen by our family.</p>
          <a class="btn btn-primary" routerLink="/shop" (click)="close()">Start shopping <app-icon name="arrow" class="arrow" /></a>
        </div>
      }
    </aside>
  `,
  styles: `
    .scrim { position: fixed; inset: 0; background: rgba(20,18,16,.42); opacity: 0; pointer-events: none; transition: opacity .35s; z-index: 190; }
    .scrim.open { opacity: 1; pointer-events: auto; }
    aside { position: fixed; top: 0; right: 0; bottom: 0; width: min(460px, 100vw); background: #fff; z-index: 200; display: flex; flex-direction: column;
      transform: translateX(100%); visibility: hidden; transition: transform .45s var(--ease), visibility .45s; box-shadow: var(--sh-3); }
    aside.open { transform: none; visibility: visible; }
    .head { display: flex; justify-content: space-between; align-items: center; padding: 20px 20px 16px 28px; }
    h2 { font-size: 28px; display: flex; align-items: baseline; gap: 12px; }
    h2 span { font-family: var(--sans); font-size: 14px; font-weight: 600; color: var(--ink-soft); }
    .ship { margin: 0 28px; padding: 14px 16px; background: var(--bg-soft); border-radius: var(--r-md); }
    .ship p { margin: 0 0 10px; font-size: 14.5px; display: flex; align-items: center; gap: 8px; }
    .ship .ok { color: var(--success); }
    .bar { height: 6px; border-radius: 4px; background: var(--line); overflow: hidden; }
    .bar i { display: block; height: 100%; background: linear-gradient(90deg, var(--gold), var(--accent)); border-radius: 4px; transition: width .6s var(--ease); }
    ul { list-style: none; margin: 0; padding: 8px 28px; overflow-y: auto; flex: 1; }
    li { display: grid; grid-template-columns: 92px 1fr; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--line); }
    li:last-child { border-bottom: 0; }
    .thumb img { width: 92px; height: 122px; object-fit: cover; border-radius: 10px; }
    .meta { display: flex; flex-direction: column; min-width: 0; }
    .top { display: flex; justify-content: space-between; gap: 8px; }
    .top a { font-weight: 600; font-size: 16px; line-height: 1.35; }
    .top a:hover { color: var(--accent); }
    .rm { border: 0; background: none; color: var(--ink-soft); width: 34px; height: 34px; flex: none; display: grid; place-items: center; border-radius: 50%; margin: -6px -6px 0 0; }
    .rm:hover { background: var(--accent-soft); color: var(--accent); }
    .meta p { margin: 2px 0 auto; font-size: 14px; color: var(--ink-soft); }
    .row { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
    .row strong { font-weight: 700; }
    .qty { display: inline-flex; align-items: center; border: 1.5px solid var(--line-strong); border-radius: 999px; height: 40px; }
    .qty button { width: 38px; height: 100%; border: 0; background: none; display: grid; place-items: center; border-radius: 999px; }
    .qty button:hover { background: var(--bg-tint); }
    .qty span { min-width: 26px; text-align: center; font-weight: 700; }
    .foot { padding: 20px 28px 24px; border-top: 1px solid var(--line); display: grid; gap: 10px; justify-items: center; background: #fff; }
    .save { margin: 0; width: 100%; text-align: center; font-size: 14px; font-weight: 600; color: var(--success); background: #eaf5ee; border-radius: 10px; padding: 8px; }
    .sum { width: 100%; display: flex; justify-content: space-between; font-size: 18px; }
    .sum strong { font-weight: 700; }
    .note { width: 100%; margin: -6px 0 4px; font-size: 13.5px; color: var(--ink-soft); }
    .empty { flex: 1; display: grid; place-content: center; justify-items: center; text-align: center; gap: 4px; padding: 24px 40px; }
    .circle { width: 88px; height: 88px; border-radius: 50%; background: var(--bg-soft); display: grid; place-items: center; margin-bottom: 14px; color: var(--accent); }
    .empty h3 { font-size: 26px; }
    .empty p { color: var(--ink-soft); margin: 6px 0 22px; }
    @media (max-width: 480px) {
      .head { padding: 16px 12px 12px 20px; }
      .ship { margin: 0 20px; }
      ul { padding: 4px 20px; }
      .foot { padding: 16px 20px 20px; }
      li { grid-template-columns: 80px 1fr; }
      .thumb img { width: 80px; height: 106px; }
    }
  `,
})
export class CartDrawer {
  protected readonly cart = inject(CartService);
  protected readonly img = img;
  protected readonly FREE_AT = FREE_AT;
  protected progress() { return Math.min(100, (this.cart.subtotal() / FREE_AT) * 100); }
  close() { this.cart.drawerOpen.set(false); }
}
