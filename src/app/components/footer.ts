import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon],
  template: `
    <section class="perks" aria-label="Why shop with us">
      <div class="container grid4">
        @for (t of perks; track t.title) {
          <div class="perk">
            <span class="ic"><app-icon [name]="t.icon" [size]="24" /></span>
            <div><strong>{{ t.title }}</strong><p>{{ t.text }}</p></div>
          </div>
        }
      </div>
    </section>

    <section class="news">
      <div class="container news-in">
        <div>
          <p class="eyebrow plain">The Sampat Circle</p>
          <h2>First look at new arrivals &amp; festive edits</h2>
          <p class="muted">Join 1,000+ women who hear about our new collections first. No spam, ever.</p>
        </div>
        <form (submit)="$event.preventDefault(); done.set(true)">
          @if (!done()) {
            <div class="pill">
              <input type="email" placeholder="Enter your email" required aria-label="Email address" />
              <button class="btn btn-accent" type="submit">Subscribe</button>
            </div>
          } @else {
            <p class="thanks"><app-icon name="check" [size]="20" [stroke]="2.2" /> You're in — welcome to the family.</p>
          }
        </form>
      </div>
    </section>

    <footer>
      <div class="container cols">
        <div class="brand">
          <div class="logo">Sampat</div>
          <p class="tag">Saree Emporium · Est. 1952</p>
          <p class="muted">Three generations of dressing women in sarees, suits and kurtis they love. Handpicked, honestly priced.</p>
          <a class="social" href="https://www.instagram.com/sampatsaree" target="_blank" rel="noopener">
            <app-icon name="instagram" [size]="20" /> &#64;sampatsaree
          </a>
        </div>
        <div>
          <h3>Shop</h3>
          <a routerLink="/shop" [queryParams]="{ c: 'sarees' }">Sarees</a>
          <a routerLink="/shop" [queryParams]="{ c: 'suits' }">Suits</a>
          <a routerLink="/shop" [queryParams]="{ c: 'kurtis' }">Kurtis</a>
          <a routerLink="/shop" [queryParams]="{ c: 'lehengas' }">Lehengas</a>
          <a routerLink="/shop">Shop all</a>
        </div>
        <div>
          <h3>Help</h3>
          <a routerLink="/contact">Contact us</a>
          <a routerLink="/contact">Visit the store</a>
          <a routerLink="/cart">Your bag</a>
          <a routerLink="/wishlist">Wishlist</a>
        </div>
        <div>
          <h3>About</h3>
          <a routerLink="/about">Our story</a>
          <a routerLink="/about">Since 1952</a>
        </div>
      </div>
      <div class="container base">
        <span>© {{ year }} Sampat Saree Emporium. All rights reserved.</span>
        <span class="pay">
          <span>COD</span><span>UPI</span><span>Cards</span>
        </span>
      </div>
    </footer>
  `,
  styles: `
    .perks { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); }
    .perk { display: flex; gap: 16px; align-items: center; padding: 30px 24px; }
    .perk + .perk { border-left: 1px solid var(--line); }
    .ic { width: 52px; height: 52px; border-radius: 50%; background: var(--bg-soft); display: grid; place-items: center; color: var(--accent); flex: none; }
    .perk strong { font-size: 16px; font-weight: 700; }
    .perk p { margin: 2px 0 0; font-size: 14.5px; color: var(--ink-soft); line-height: 1.45; }

    .news { background: var(--ink); color: #fff; padding: 72px 0; }
    .news-in { display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; align-items: center; }
    .news .eyebrow { color: #e7c98f; }
    .news h2 { color: #fff; font-size: clamp(28px, 3.2vw, 40px); margin: 12px 0 12px; }
    .news .muted { color: rgba(255,255,255,.72); margin: 0; }
    .pill { display: flex; gap: 8px; background: #fff; padding: 6px; border-radius: 999px; }
    .pill input { border: 0; min-height: 52px; border-radius: 999px; padding-left: 20px; }
    .pill input:focus { box-shadow: none; }
    .thanks { display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 600; color: #b9e4c9; margin: 0; }

    footer { padding: 72px 0 0; background: var(--bg-soft); }
    .cols { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; }
    .logo { font-family: var(--serif); font-weight: 600; font-size: 30px; letter-spacing: .2em; text-transform: uppercase; }
    .tag { margin: 4px 0 16px; font-size: 12px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }
    .brand .muted { max-width: 360px; }
    .social { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; margin-top: 4px; }
    .social:hover { color: var(--accent); }
    h3 { font-family: var(--sans); font-size: 15px; font-weight: 700; margin-bottom: 14px; }
    .cols > div > a:not(.social) { display: block; padding: 6px 0; color: var(--ink-soft); font-weight: 500; transition: color .2s; }
    .cols > div > a:not(.social):hover { color: var(--accent); }
    .base { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding-top: 24px; padding-bottom: 28px; margin-top: 56px; border-top: 1px solid var(--line); font-size: 14px; color: var(--ink-soft); }
    .pay { display: flex; gap: 8px; }
    .pay span { padding: 4px 12px; border: 1.5px solid var(--line-strong); border-radius: 8px; font-size: 12.5px; font-weight: 700; color: var(--ink-2); background: #fff; }

    @media (max-width: 960px) {
      .grid4 { grid-template-columns: 1fr 1fr; }
      .perk:nth-child(3) { border-left: 0; }
      .perk:nth-child(n+3) { border-top: 1px solid var(--line); }
      .news-in { grid-template-columns: 1fr; gap: 28px; }
      .cols { grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
      .brand { grid-column: 1 / -1; }
    }
    @media (max-width: 560px) {
      .grid4 { grid-template-columns: 1fr; }
      .perk { padding: 18px 4px; }
      .perk + .perk { border-left: 0; border-top: 1px solid var(--line); }
      .pill { flex-direction: column; border-radius: 20px; }
      .pill .btn { width: 100%; }
      .cols { grid-template-columns: 1fr 1fr; }
      .base { flex-direction: column; align-items: flex-start; }
    }
  `,
})
export class Footer {
  protected readonly done = signal(false);
  protected readonly year = new Date().getFullYear();
  protected readonly perks = [
    { icon: 'sparkle', title: 'Handpicked weaves', text: 'Chosen by our family since 1952' },
    { icon: 'truck', title: 'Free shipping', text: 'On all orders above ₹2,999' },
    { icon: 'refresh', title: 'Easy exchange', text: 'Hassle-free within 7 days' },
    { icon: 'cash', title: 'Cash on delivery', text: 'Pay when it reaches you' },
  ];
}
