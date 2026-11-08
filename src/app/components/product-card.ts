import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product, img } from '../data/products';
import { CartService } from '../services/cart.service';
import { InrPipe } from './inr.pipe';
import { Icon } from '../shared/icon';
import { ImgFade } from '../shared/img-fade.directive';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, InrPipe, Icon, ImgFade],
  template: `
    @let p = product();
    <article class="card">
      <div class="media skeleton">
        <a [routerLink]="['/product', p.id]" class="img-link" [attr.aria-label]="p.name">
          <img fade [src]="img(p.images[0], 700)" [alt]="p.name" loading="lazy" class="main" />
          @if (p.images[1]) { <img fade [src]="img(p.images[1], 700)" alt="" loading="lazy" class="alt" /> }
        </a>
        <div class="badges">
          @if (p.tag) { <span class="badge" [class.accent]="p.tag === 'Festive'">{{ p.tag }}</span> }
          @if (off() >= 15) { <span class="badge gold">−{{ off() }}%</span> }
        </div>
        <button class="wish" [class.on]="wished()" (click)="cart.toggleWish(p.id)"
                [attr.aria-pressed]="wished()" [attr.aria-label]="(wished() ? 'Remove ' : 'Save ') + p.name + ' to wishlist'">
          <app-icon name="heart" [size]="20" [stroke]="1.8" />
        </button>
        <button class="quick" (click)="cart.add(p.id)" [attr.aria-label]="'Add ' + p.name + ' to bag'">
          <app-icon name="plus" [size]="18" [stroke]="2" /> <span>Add to bag</span>
        </button>
      </div>
      <div class="info">
        <p class="fabric">{{ p.fabric }}</p>
        <h3><a [routerLink]="['/product', p.id]">{{ p.name }}</a></h3>
        <div class="foot">
          <p class="price">
            <strong>{{ p.price | inr }}</strong>
            @if (p.mrp > p.price) { <s>{{ p.mrp | inr }}</s> }
          </p>
          <span class="dots">
            @for (c of p.colors; track c) { <i [style.background]="c"></i> }
          </span>
        </div>
      </div>
    </article>
  `,
  styles: `
    .card { position: relative; }
    .media { position: relative; aspect-ratio: 3 / 4; overflow: hidden; border-radius: var(--r-md); }
    .img-link { position: absolute; inset: 0; }
    .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .main.loaded { transition: opacity .6s var(--ease), transform 1.4s var(--ease); }
    .alt.loaded { opacity: 0; transition: opacity .6s var(--ease); }
    .card:hover .main { transform: scale(1.04); }
    .card:hover .alt.loaded { opacity: 1; }

    .badges { position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; pointer-events: none; }
    .wish { position: absolute; top: 10px; right: 10px; width: 42px; height: 42px; border: 0; border-radius: 50%;
      background: rgba(255,255,255,.94); box-shadow: var(--sh-1); display: grid; place-items: center; color: var(--ink);
      transition: transform .2s var(--ease), color .2s; }
    .wish:hover { transform: scale(1.08); }
    .wish.on { color: var(--accent); }
    .wish.on ::ng-deep svg { fill: currentColor; animation: beat .45s var(--ease); }
    @keyframes beat { 40% { transform: scale(1.3); } }

    .quick { position: absolute; left: 12px; right: 12px; bottom: 12px; height: 48px; border: 0; border-radius: 999px;
      background: rgba(255,255,255,.96); color: var(--ink); box-shadow: var(--sh-2); font-weight: 700; font-size: 14.5px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      opacity: 0; transform: translateY(10px); transition: opacity .3s var(--ease), transform .3s var(--ease), background .2s, color .2s; }
    .card:hover .quick, .quick:focus-visible { opacity: 1; transform: none; }
    .quick:hover { background: var(--ink); color: #fff; }

    .info { padding: 16px 4px 0; }
    .fabric { margin: 0; font-size: 13px; font-weight: 600; color: var(--gold); letter-spacing: .02em; }
    h3 { font-size: 19px; font-weight: 500; margin: 4px 0 10px; line-height: 1.3; }
    h3 a { background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat; transition: background-size .35s var(--ease); }
    h3 a:hover { background-size: 100% 1px; }
    .foot { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .price { margin: 0; display: flex; gap: 10px; align-items: baseline; }
    .price strong { font-size: 16.5px; font-weight: 700; }
    .price s { color: var(--ink-soft); font-size: 14.5px; }
    .dots { display: flex; gap: 4px; }
    .dots i { width: 14px; height: 14px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); }

    @media (hover: none) {
      .quick { opacity: 1; transform: none; left: auto; width: 44px; height: 44px; padding: 0; right: 10px; bottom: 10px; }
      .quick span { display: none; }
    }
    @media (max-width: 560px) {
      h3 { font-size: 16.5px; }
      .fabric { font-size: 12px; }
      .price strong { font-size: 15.5px; }
      .price s { font-size: 13px; }
      .dots { display: none; }
    }
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
  protected readonly cart = inject(CartService);
  protected readonly img = img;
  protected readonly wished = computed(() => this.cart.wishlist().includes(this.product().id));
  protected readonly off = computed(() => Math.round((1 - this.product().price / this.product().mrp) * 100));
}
