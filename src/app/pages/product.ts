import { Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CATEGORIES, PRODUCTS, findProduct, img } from '../data/products';
import { CartService } from '../services/cart.service';
import { InrPipe } from '../components/inr.pipe';
import { ProductCard } from '../components/product-card';
import { Icon } from '../shared/icon';
import { ImgFade } from '../shared/img-fade.directive';

@Component({
  selector: 'app-product',
  imports: [RouterLink, InrPipe, ProductCard, Icon, ImgFade],
  template: `
    @if (product(); as p) {
      <div class="container">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a routerLink="/">Home</a><app-icon name="chevron" [size]="14" />
          <a routerLink="/shop" [queryParams]="{ c: p.category }">{{ catName() }}</a><app-icon name="chevron" [size]="14" />
          <span>{{ p.name }}</span>
        </nav>

        <div class="pdp">
          <div class="gallery">
            @if (p.images.length > 1) {
              <div class="thumbs" role="tablist" aria-label="Product images">
                @for (im of p.images; track im; let i = $index) {
                  <button role="tab" [attr.aria-selected]="active() === i" [class.on]="active() === i" (click)="active.set(i)" [attr.aria-label]="'Image ' + (i + 1)">
                    <img [src]="img(im, 200)" alt="" />
                  </button>
                }
              </div>
            }
            <div class="main skeleton" (mousemove)="zoomAt($event)" (mouseleave)="zoom.set(null)">
              @for (im of p.images; track im; let i = $index) {
                @if (active() === i) {
                  <img fade [src]="img(im, 1400)" [alt]="p.name" [style.transform-origin]="zoom() ?? 'center'" [class.zoomed]="!!zoom()" />
                }
              }
              @if (p.tag) { <span class="badge" [class.accent]="p.tag === 'Festive'">{{ p.tag }}</span> }
              <span class="hint"><app-icon name="zoom" [size]="16" /> Hover to zoom</span>
              @if (p.images.length > 1) {
                <div class="dots">
                  @for (im of p.images; track im; let i = $index) { <button [class.on]="active() === i" (click)="active.set(i)" [attr.aria-label]="'Image ' + (i + 1)"></button> }
                </div>
              }
            </div>
          </div>

          <div class="details">
            <p class="fabric">{{ p.fabric }}</p>
            <h1>{{ p.name }}</h1>
            <div class="price">
              <strong>{{ p.price | inr }}</strong>
              @if (p.mrp > p.price) {
                <s>MRP {{ p.mrp | inr }}</s>
                <span class="off">{{ off() }}% off</span>
              }
            </div>
            <p class="tax">Inclusive of all taxes · Free shipping above ₹2,999</p>

            <p class="desc">{{ p.description }}</p>

            <div class="opt">
              <p class="lbl">Colour</p>
              <div class="swatches">
                @for (c of p.colors; track c) { <span [style.background]="c" [attr.aria-label]="c"></span> }
              </div>
            </div>

            <div class="buy">
              <div class="qty" role="group" aria-label="Quantity">
                <button (click)="qty.set(qty() > 1 ? qty() - 1 : 1)" aria-label="Decrease quantity" [disabled]="qty() <= 1"><app-icon name="minus" [size]="18" /></button>
                <span aria-live="polite">{{ qty() }}</span>
                <button (click)="qty.set(qty() + 1)" aria-label="Increase quantity"><app-icon name="plus" [size]="18" /></button>
              </div>
              <button class="btn btn-primary btn-lg add" (click)="add()">
                @if (added()) { <app-icon name="check" [size]="20" [stroke]="2.2" /> Added to bag }
                @else { <app-icon name="bag" [size]="20" /> Add to bag<span class="p">&nbsp;· {{ p.price * qty() | inr }}</span> }
              </button>
              <button class="wish" [class.on]="wished()" (click)="cart.toggleWish(p.id)" [attr.aria-pressed]="wished()" aria-label="Save to wishlist">
                <app-icon name="heart" [size]="22" [stroke]="1.8" />
              </button>
            </div>

            <div class="assure">
              <div><app-icon name="truck" /><span><strong>Delivery in 5–7 days</strong>Dispatched in 2–3 working days</span></div>
              <div><app-icon name="refresh" /><span><strong>7-day exchange</strong>On unused items with tags</span></div>
              <div><app-icon name="shield" /><span><strong>Quality checked</strong>Inspected by hand before dispatch</span></div>
              <div><app-icon name="cash" /><span><strong>Cash on delivery</strong>Or pay by UPI</span></div>
            </div>

            <div class="acc">
              @for (s of sections(); track s.title; let i = $index) {
                <div class="acc-item" [class.open]="openAcc() === i">
                  <button (click)="openAcc.set(openAcc() === i ? -1 : i)" [attr.aria-expanded]="openAcc() === i">
                    {{ s.title }} <app-icon name="chevron-down" [size]="20" />
                  </button>
                  <div class="acc-body"><div><p>{{ s.body }}</p></div></div>
                </div>
              }
            </div>
          </div>
        </div>

        <section class="related">
          <div class="row-head">
            <div><p class="eyebrow">You may also love</p><h2>Complete the look</h2></div>
            <a class="text-link" routerLink="/shop" [queryParams]="{ c: p.category }">More {{ catName().toLowerCase() }} <app-icon name="arrow" [size]="16" /></a>
          </div>
          <div class="grid">
            @for (r of related(); track r.id) { <app-product-card [product]="r" /> }
          </div>
        </section>
      </div>

      <!-- mobile sticky bar -->
      <div class="sticky">
        <div><strong>{{ p.price | inr }}</strong>@if (p.mrp > p.price) { <s>{{ p.mrp | inr }}</s> }</div>
        <button class="btn btn-primary" (click)="add()">
          @if (added()) { <app-icon name="check" [size]="18" [stroke]="2.2" /> Added } @else { Add to bag }
        </button>
      </div>
    } @else {
      <div class="container missing">
        <h1>We couldn't find that piece</h1>
        <p>It may have sold out. Explore the rest of the collection.</p>
        <a class="btn btn-primary" routerLink="/shop">Back to shop <app-icon name="arrow" class="arrow" /></a>
      </div>
    }
  `,
  styles: `
    .crumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; padding: 24px 0; font-size: 14px; font-weight: 600; color: var(--ink-soft); }
    .crumbs a:hover { color: var(--accent); }
    .crumbs span { color: var(--ink); }
    .pdp { display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: start; }
    .gallery { display: flex; gap: 16px; position: sticky; top: 92px; }
    .thumbs { display: flex; flex-direction: column; gap: 12px; width: 84px; flex: none; }
    .thumbs button { padding: 0; border: 2px solid transparent; border-radius: 12px; overflow: hidden; background: none; opacity: .6; transition: .25s; }
    .thumbs button:hover { opacity: 1; }
    .thumbs button.on { border-color: var(--ink); opacity: 1; }
    .thumbs img { width: 100%; aspect-ratio: 3/4; object-fit: cover; }
    .main { position: relative; flex: 1; aspect-ratio: 3/4; overflow: hidden; border-radius: var(--r-lg); cursor: zoom-in; }
    .main img { width: 100%; height: 100%; object-fit: cover; }
    .main img.loaded { transition: opacity .5s, transform .35s var(--ease); }
    .main img.zoomed { transform: scale(1.8); }
    .main .badge { position: absolute; top: 16px; left: 16px; }
    .hint { position: absolute; bottom: 16px; right: 16px; display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 999px;
      background: rgba(255,255,255,.92); font-size: 13px; font-weight: 600; pointer-events: none; transition: opacity .3s; }
    .main:hover .hint { opacity: 0; }
    .dots { display: none; }

    .fabric { margin: 0; font-size: 14.5px; font-weight: 700; color: var(--gold); letter-spacing: .02em; }
    h1 { font-size: clamp(32px, 3.4vw, 46px); margin: 8px 0 18px; line-height: 1.12; }
    .price { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
    .price strong { font-size: 28px; font-weight: 700; letter-spacing: -.01em; }
    .price s { font-size: 17px; color: var(--ink-soft); }
    .off { background: var(--accent-soft); color: var(--accent); font-weight: 700; font-size: 14px; padding: 4px 10px; border-radius: 999px; }
    .tax { margin: 6px 0 0; font-size: 14px; color: var(--ink-soft); }
    .desc { margin: 24px 0 0; padding-top: 24px; border-top: 1px solid var(--line); font-size: 17px; color: var(--ink-2); line-height: 1.75; }
    .opt { margin-top: 24px; }
    .lbl { margin: 0 0 10px; font-weight: 700; font-size: 15px; }
    .swatches { display: flex; gap: 10px; }
    .swatches span { width: 36px; height: 36px; border-radius: 50%; box-shadow: 0 0 0 1px var(--line-strong), inset 0 0 0 3px #fff; }
    .swatches span:first-child { box-shadow: 0 0 0 2px var(--ink), inset 0 0 0 3px #fff; }

    .buy { display: flex; gap: 10px; margin-top: 28px; }
    .qty { display: flex; align-items: center; border: 1.5px solid var(--line-strong); border-radius: 999px; height: 60px; }
    .qty button { width: 48px; height: 100%; border: 0; background: none; display: grid; place-items: center; border-radius: 999px; }
    .qty button:hover:not(:disabled) { background: var(--bg-tint); }
    .qty button:disabled { opacity: .35; cursor: not-allowed; }
    .qty span { min-width: 28px; text-align: center; font-weight: 700; font-size: 17px; }
    .add { flex: 1; min-width: 0; }
    .wish { width: 60px; height: 60px; flex: none; border-radius: 50%; border: 1.5px solid var(--line-strong); background: #fff; display: grid; place-items: center; transition: .2s; }
    .wish:hover { border-color: var(--accent); color: var(--accent); }
    .wish.on { color: var(--accent); border-color: var(--accent); background: var(--accent-soft); }
    .wish.on ::ng-deep svg { fill: currentColor; }

    .assure { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 28px; }
    .assure div { display: flex; gap: 12px; align-items: flex-start; padding: 16px; border-radius: var(--r-md); background: var(--bg-soft); color: var(--accent); }
    .assure span { display: grid; color: var(--ink-soft); font-size: 13.5px; line-height: 1.45; }
    .assure strong { color: var(--ink); font-size: 15px; font-weight: 700; }

    .acc { margin-top: 28px; border-top: 1px solid var(--line); }
    .acc-item { border-bottom: 1px solid var(--line); }
    .acc-item > button { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border: 0; background: none; font-weight: 700; font-size: 16px; text-align: left; }
    .acc-item app-icon { transition: transform .3s var(--ease); }
    .acc-item.open > button app-icon { transform: rotate(180deg); }
    .acc-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s var(--ease); }
    .acc-item.open .acc-body { grid-template-rows: 1fr; }
    .acc-body > div { overflow: hidden; }
    .acc-body p { margin: 0 0 20px; color: var(--ink-soft); white-space: pre-line; }

    .related { padding: 120px 0 112px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .missing { text-align: center; padding: 120px 16px; }
    .missing p { color: var(--ink-soft); margin: 14px 0 28px; }
    .sticky { display: none; }

    @media (max-width: 960px) {
      .pdp { grid-template-columns: 1fr; gap: 28px; }
      .gallery { position: static; flex-direction: column-reverse; }
      .thumbs { display: none; }
      .main { border-radius: var(--r-md); cursor: default; }
      .main img.zoomed { transform: none; }
      .hint { display: none; }
      .dots { display: flex; gap: 8px; position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); }
      .dots button { width: 8px; height: 8px; border-radius: 4px; border: 0; padding: 0; background: rgba(255,255,255,.7); transition: width .3s; }
      .dots button.on { width: 22px; background: #fff; }
      .grid { grid-template-columns: repeat(2, 1fr); gap: 32px 14px; }
      .related { padding: 72px 0 120px; }
      .sticky { display: flex; position: fixed; left: 0; right: 0; bottom: 0; z-index: 60; justify-content: space-between; align-items: center; gap: 16px;
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); background: rgba(255,255,255,.96); backdrop-filter: blur(12px); border-top: 1px solid var(--line); }
      .sticky strong { font-size: 19px; font-weight: 700; }
      .sticky s { margin-left: 8px; color: var(--ink-soft); font-size: 14px; }
      .sticky .btn { flex: 0 0 55%; }
    }
    @media (max-width: 480px) {
      .assure { grid-template-columns: 1fr; }
      .buy .add { padding: 0 16px; }
      .add .p { display: none; }
      .qty, .wish { height: 56px; }
      .wish { width: 56px; }
      .buy { gap: 8px; }
      .qty button { width: 40px; }
    }
  `,
})
export class ProductPage {
  readonly id = input.required<string>();
  protected readonly cart = inject(CartService);
  protected readonly img = img;
  protected readonly product = computed(() => findProduct(this.id()));
  protected readonly active = linkedSignal({ source: this.id, computation: () => 0 });
  protected readonly qty = linkedSignal({ source: this.id, computation: () => 1 });
  protected readonly openAcc = signal(0);
  protected readonly zoom = signal<string | null>(null);
  protected readonly added = signal(false);
  protected readonly wished = computed(() => this.cart.wishlist().includes(this.id()));
  protected readonly off = computed(() => { const p = this.product(); return p ? Math.round((1 - p.price / p.mrp) * 100) : 0; });
  protected readonly catName = computed(() => CATEGORIES.find(c => c.slug === this.product()?.category)?.name ?? '');
  protected readonly sections = computed(() => {
    const p = this.product();
    if (!p) return [];
    return [
      { title: 'Product details', body: `Fabric: ${p.fabric}\nCategory: ${this.catName()}\n${p.category === 'sarees' ? 'Length: 5.5 m saree + 0.8 m unstitched blouse piece' : 'Fit: Regular · Size guidance available on request'}` },
      { title: 'Care', body: 'Dry clean recommended for silks and embellished pieces. Store folded in a muslin cloth, away from direct sunlight.' },
      { title: 'Shipping & exchange', body: 'Dispatched within 2–3 working days and delivered across India in 5–7 days. Exchange within 7 days of delivery on unused items with tags intact.' },
    ];
  });
  protected readonly related = computed(() => {
    const p = this.product();
    if (!p) return [];
    return [...PRODUCTS.filter(x => x.category === p.category && x.id !== p.id), ...PRODUCTS.filter(x => x.category !== p.category)].slice(0, 4);
  });

  constructor() {
    const title = inject(Title);
    effect(() => { const p = this.product(); if (p) title.setTitle(`${p.name} — Sampat Saree Emporium`); });
  }

  add() {
    const p = this.product();
    if (!p) return;
    this.cart.add(p.id, this.qty());
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1800);
  }
  zoomAt(e: MouseEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.zoom.set(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  }
}
