import { Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { CartService } from '../services/cart.service';
import { UiService } from '../services/ui.service';
import { CATEGORIES, img } from '../data/products';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon],
  host: { '(window:scroll)': 'onScroll()' },
  template: `
    <div class="announce" aria-live="off">
      <div class="container ann-in">
        <span class="msgs">
          @for (m of messages; track m; let i = $index) { <span [class.on]="i === msg()">{{ m }}</span> }
        </span>
      </div>
    </div>

    <header [class.scrolled]="scrolled()">
      <div class="container bar">
        <div class="left">
          <button class="icon-btn burger" (click)="ui.menuOpen.set(true)" aria-label="Open menu"><app-icon name="menu" /></button>
          <nav aria-label="Primary">
            @for (c of categories; track c.slug) {
              <a routerLink="/shop" [queryParams]="{ c: c.slug }">{{ c.name }}</a>
            }
            <a routerLink="/about" routerLinkActive="active">Our Story</a>
          </nav>
        </div>

        <a routerLink="/" class="logo" aria-label="Sampat Saree Emporium — home">
          <span class="name">Sampat</span>
          <span class="sub">Saree Emporium · Est. 1952</span>
        </a>

        <div class="right">
          <button class="icon-btn" (click)="ui.searchOpen.set(true)" aria-label="Search (press /)"><app-icon name="search" /></button>
          <a routerLink="/contact" class="icon-btn hide-sm" aria-label="Visit the store"><app-icon name="pin" /></a>
          <a routerLink="/wishlist" class="icon-btn" aria-label="Wishlist">
            <app-icon name="heart" />
            @if (cart.wishlist().length) { <span class="count">{{ cart.wishlist().length }}</span> }
          </a>
          <button class="icon-btn" (click)="cart.drawerOpen.set(true)" aria-label="Open bag">
            <app-icon name="bag" />
            @if (cart.count()) { <span class="count bump">{{ cart.count() }}</span> }
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile menu -->
    <div class="m-scrim" [class.open]="ui.menuOpen()" (click)="ui.menuOpen.set(false)"></div>
    <aside class="m-menu" [class.open]="ui.menuOpen()" aria-label="Menu" [attr.aria-hidden]="!ui.menuOpen()">
      <div class="m-head">
        <span class="name sm">Sampat</span>
        <button class="icon-btn" (click)="ui.menuOpen.set(false)" aria-label="Close menu"><app-icon name="close" /></button>
      </div>
      <div class="m-cats">
        @for (c of categories; track c.slug) {
          <a routerLink="/shop" [queryParams]="{ c: c.slug }">
            <img [src]="img(c.image, 300)" alt="" loading="lazy" /><span>{{ c.name }}</span>
          </a>
        }
      </div>
      <nav class="m-links">
        <a routerLink="/shop">Shop all <app-icon name="chevron" [size]="18" /></a>
        <a routerLink="/wishlist">Wishlist <app-icon name="chevron" [size]="18" /></a>
        <a routerLink="/about">Our Story <app-icon name="chevron" [size]="18" /></a>
        <a routerLink="/contact">Visit the store <app-icon name="chevron" [size]="18" /></a>
      </nav>
      <a class="m-insta" href="https://www.instagram.com/sampatsaree" target="_blank" rel="noopener">
        <app-icon name="instagram" [size]="20" /> Follow &#64;sampatsaree
      </a>
    </aside>
  `,
  styles: `
    .announce { background: var(--ink); color: #f5efe6; font-size: 13.5px; font-weight: 500; letter-spacing: .01em; }
    .ann-in { height: 40px; display: grid; place-items: center; }
    .msgs { display: grid; text-align: center; }
    .msgs span { grid-area: 1 / 1; opacity: 0; transform: translateY(8px); transition: opacity .5s, transform .5s var(--ease); }
    .msgs span.on { opacity: 1; transform: none; }

    header { position: sticky; top: 0; z-index: 80; background: rgba(255,255,255,.92); backdrop-filter: saturate(1.6) blur(14px);
      border-bottom: 1px solid transparent; transition: border-color .3s, box-shadow .3s; }
    header.scrolled { border-bottom-color: var(--line); box-shadow: 0 6px 24px rgba(20,18,16,.05); }
    .bar { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; height: 84px; transition: height .3s var(--ease); }
    header.scrolled .bar { height: 68px; }

    .left { display: flex; align-items: center; }
    nav { display: flex; gap: 6px; }
    nav a { position: relative; padding: 10px 14px; border-radius: 999px; font-size: 15px; font-weight: 600; color: var(--ink-2); white-space: nowrap; transition: background .2s, color .2s; }
    nav a:hover, nav a.active { background: var(--bg-tint); color: var(--ink); }

    .logo { display: grid; justify-items: center; line-height: 1; padding: 6px 12px; }
    .name { font-family: var(--serif); font-weight: 600; font-size: 34px; letter-spacing: .2em; text-transform: uppercase; padding-left: .2em; color: var(--ink); transition: font-size .3s var(--ease); }
    header.scrolled .name { font-size: 28px; }
    .sub { margin-top: 7px; font-size: 11px; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; color: var(--gold); }
    .right { display: flex; justify-content: flex-end; gap: 2px; }
    .count { position: absolute; top: 3px; right: 1px; min-width: 19px; height: 19px; padding: 0 5px; border-radius: 10px; border: 2px solid #fff;
      background: var(--accent); color: #fff; font-size: 11px; font-weight: 700; display: grid; place-items: center; line-height: 1; }
    .burger { display: none; }

    .m-scrim { position: fixed; inset: 0; background: rgba(20,18,16,.4); opacity: 0; pointer-events: none; transition: opacity .3s; z-index: 140; }
    .m-scrim.open { opacity: 1; pointer-events: auto; }
    .m-menu { position: fixed; top: 0; bottom: 0; left: 0; width: min(380px, 88vw); z-index: 150; background: #fff; overflow-y: auto;
      transform: translateX(-100%); transition: transform .4s var(--ease); padding: 0 20px 28px; visibility: hidden; }
    .m-menu.open { transform: none; visibility: visible; }
    .m-head { display: flex; justify-content: space-between; align-items: center; height: 72px; }
    .name.sm { font-size: 24px; padding-left: 0; }
    .m-cats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .m-cats a { position: relative; aspect-ratio: 1; border-radius: var(--r-md); overflow: hidden; }
    .m-cats img { width: 100%; height: 100%; object-fit: cover; }
    .m-cats a::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,.55), transparent 60%); }
    .m-cats span { position: absolute; left: 12px; bottom: 10px; z-index: 1; color: #fff; font-family: var(--serif); font-size: 20px; }
    .m-links { display: grid; gap: 0; margin-top: 18px; }
    .m-links a { display: flex; justify-content: space-between; align-items: center; padding: 16px 4px; border-bottom: 1px solid var(--line); font-size: 17px; font-weight: 600; border-radius: 0; background: none; }
    .m-insta { display: flex; align-items: center; gap: 10px; margin-top: 24px; font-weight: 600; color: var(--accent); }

    @media (max-width: 1180px) { nav a { padding: 10px 10px; font-size: 14.5px; } }
    @media (max-width: 1060px) {
      nav { display: none; }
      .burger { display: inline-grid; }
      .bar { height: 68px; }
      header.scrolled .bar { height: 60px; }
      .name { font-size: 26px; letter-spacing: .16em; }
      header.scrolled .name { font-size: 24px; }
      .sub { font-size: 9.5px; letter-spacing: .18em; margin-top: 5px; }
    }
    @media (max-width: 560px) {
      .hide-sm { display: none; }
      .announce { font-size: 12.5px; }
      .ann-in { height: 36px; }
      .name { font-size: 22px; letter-spacing: .12em; padding-left: .12em; }
      header.scrolled .name { font-size: 21px; }
      .sub { display: none; }
      .right { gap: 0; }
      .icon-btn { width: 40px; height: 40px; }
    }
  `,
})
export class Header {
  protected readonly cart = inject(CartService);
  protected readonly ui = inject(UiService);
  protected readonly categories = CATEGORIES;
  protected readonly img = img;
  protected readonly scrolled = signal(false);
  onScroll() { this.scrolled.set(window.scrollY > 24); }
  protected readonly messages = [
    'Free shipping across India on orders above ₹2,999',
    "Women's favourite ethnic wear shop since 1952",
    'Cash on delivery · Easy 7-day exchange',
  ];
  protected readonly msg = signal(0);

  constructor() {
    setInterval(() => this.msg.update(i => (i + 1) % this.messages.length), 4000);
    inject(Router).events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.ui.menuOpen.set(false));
    effect(() => { document.body.style.overflow = this.ui.menuOpen() || this.ui.searchOpen() || this.cart.drawerOpen() ? 'hidden' : ''; });
  }
}
