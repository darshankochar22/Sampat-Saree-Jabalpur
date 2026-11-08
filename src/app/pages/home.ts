import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES, PRODUCTS, img } from '../data/products';
import { ProductCard } from '../components/product-card';
import { InrPipe } from '../components/inr.pipe';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal.directive';
import { ImgFade } from '../shared/img-fade.directive';

type Tab = 'new' | 'best' | 'festive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard, InrPipe, Icon, Reveal, ImgFade],
  template: `
    <!-- ═════ HERO ═════ -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-text">
          <p class="eyebrow fade-up">The Festive Edit · 2026</p>
          <h1 class="fade-up" style="--d: 80ms">Six yards of <em>heritage</em>, woven for you</h1>
          <p class="lead fade-up" style="--d: 160ms">Banarasi, Kanjeevaram and everyday sarees, suits &amp; kurtis — handpicked by the same family since 1952.</p>
          <div class="cta fade-up" style="--d: 240ms">
            <a class="btn btn-primary btn-lg" routerLink="/shop" [queryParams]="{ c: 'sarees' }">Shop sarees <app-icon name="arrow" class="arrow" /></a>
            <a class="btn btn-outline btn-lg" routerLink="/shop" [queryParams]="{ c: 'lehengas' }">Bridal collection</a>
          </div>
          <div class="trust fade-up" style="--d: 320ms">
            <div class="avatars">
              @for (a of avatars; track a) { <img [src]="img(a, 120)" alt="" /> }
            </div>
            <div>
              <div class="stars">@for (s of [1,2,3,4,5]; track s) { <app-icon name="star" [size]="16" /> }</div>
              <p>Trusted by <strong>3 generations</strong> of families</p>
            </div>
          </div>
        </div>

        <div class="hero-art">
          <div class="frame f1 skeleton"><img fade [src]="img('photo-1617627143750-d86bc21e42bb', 1000)" alt="Model in a pink and orange chiffon saree" fetchpriority="high" /></div>
          <div class="frame f2 skeleton"><img fade [src]="img('photo-1679006831648-7c9ea12e5807', 600)" alt="Model in an emerald Kanjeevaram saree" /></div>
          <a class="float-card" [routerLink]="['/product', featured.id]">
            <img [src]="img(featured.images[0], 160)" alt="" />
            <div>
              <span class="fc-label">Bestseller</span>
              <strong>{{ featured.name }}</strong>
              <em>{{ featured.price | inr }}</em>
            </div>
            <span class="go"><app-icon name="arrow" [size]="16" /></span>
          </a>
          <div class="since"><span>Est.</span><strong>1952</strong></div>
        </div>
      </div>
    </section>

    <!-- ═════ MARQUEE ═════ -->
    <div class="marquee" aria-hidden="true">
      <div class="track">
        @for (n of [1, 2]; track n) {
          @for (w of weaves; track w) { <span>{{ w }}</span><i><app-icon name="sparkle" [size]="14" /></i> }
        }
      </div>
    </div>

    <!-- ═════ CATEGORIES ═════ -->
    <section class="section container">
      <div class="section-head" reveal>
        <p class="eyebrow center">Shop by category</p>
        <h2>Curated for every occasion</h2>
        <p>From your everyday kurti to the saree you'll pass down — find it here.</p>
      </div>
      <div class="cats">
        @for (c of categories; track c.slug; let i = $index) {
          <a class="cat" routerLink="/shop" [queryParams]="{ c: c.slug }" [reveal]="i * 90">
            <div class="arch skeleton"><img fade [src]="img(c.image, 700)" [alt]="c.name" loading="lazy" /></div>
            <div class="cat-meta">
              <h3>{{ c.name }}</h3>
              <span class="count">{{ countIn(c.slug) }} styles</span>
            </div>
            <p>{{ c.blurb }}</p>
          </a>
        }
      </div>
    </section>

    <!-- ═════ PRODUCTS (tabs) ═════ -->
    <section class="section soft">
      <div class="container">
        <div class="row-head" reveal>
          <div>
            <p class="eyebrow">The collection</p>
            <h2>Pieces you'll love</h2>
          </div>
          <div class="tabs" role="tablist" aria-label="Collections">
            @for (t of tabs; track t.id) {
              <button role="tab" [attr.aria-selected]="tab() === t.id" [class.on]="tab() === t.id" (click)="tab.set(t.id)">{{ t.label }}</button>
            }
          </div>
        </div>
        <div class="grid4">
          @for (p of tabProducts(); track p.id; let i = $index) {
            <app-product-card [product]="p" class="fade-up" [style.--d]="i * 70 + 'ms'" />
          }
        </div>
        <div class="center-cta">
          <a class="btn btn-outline" routerLink="/shop">View all products <app-icon name="arrow" class="arrow" /></a>
        </div>
      </div>
    </section>

    <!-- ═════ EDITORIAL ═════ -->
    <section class="editorial">
      <img fade [src]="img('photo-1630526720753-aa4e71acf67d', 1900)" alt="Couple in Indian wedding attire by a river" loading="lazy" />
      <div class="container ed-wrap">
        <div class="ed-card" reveal>
          <p class="eyebrow plain">The Bridal Atelier</p>
          <h2>For the day you've dreamt of forever</h2>
          <p>Book a private appointment at our store. Try heirloom silks and bridal lehengas with our stylists, at your own pace.</p>
          <div class="ed-cta">
            <a class="btn btn-light" routerLink="/shop" [queryParams]="{ c: 'lehengas' }">Explore bridal <app-icon name="arrow" class="arrow" /></a>
            <a class="btn btn-glass" routerLink="/contact">Book a visit</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ═════ STORY ═════ -->
    <section class="section container story">
      <div class="story-art" reveal>
        <img fade [src]="img('photo-1787220272461-2c53528c9349', 900)" alt="Close-up of embroidered fabric" loading="lazy" class="s1" />
        <img fade [src]="img('photo-1717585679395-bbe39b5fb6bc', 600)" alt="Folded fabrics in the shop" loading="lazy" class="s2" />
      </div>
      <div class="story-text" reveal="120">
        <p class="eyebrow">Our story</p>
        <h2>A family shop on Main Road, since 1952</h2>
        <p class="lead">What began as a small counter of handloom sarees is today the town's favourite destination for ethnic wear.</p>
        <p class="muted">Every piece is still chosen by hand — for its weave, its drape, and the way it makes you feel. That's a promise three generations have kept.</p>
        <div class="nums">
          <div><strong>74</strong><span>years of trust</span></div>
          <div><strong>3</strong><span>generations</span></div>
          <div><strong>4</strong><span>collections</span></div>
        </div>
        <a class="text-link" routerLink="/about">Read our story <app-icon name="arrow" [size]="16" /></a>
      </div>
    </section>

    <!-- ═════ TESTIMONIALS ═════ -->
    <section class="section soft">
      <div class="container">
        <div class="section-head" reveal>
          <p class="eyebrow center">Kind words</p>
          <h2>Loved by our customers</h2>
        </div>
        <div class="quotes">
          @for (q of quotes; track q.name; let i = $index) {
            <figure [reveal]="i * 100">
              <div class="stars">@for (s of [1,2,3,4,5]; track s) { <app-icon name="star" [size]="18" /> }</div>
              <blockquote>“{{ q.text }}”</blockquote>
              <figcaption>
                <span class="av">{{ q.name[0] }}</span>
                <span><strong>{{ q.name }}</strong><small>{{ q.where }}</small></span>
              </figcaption>
            </figure>
          }
        </div>
      </div>
    </section>

    <!-- ═════ INSTAGRAM ═════ -->
    <section class="section container">
      <div class="row-head" reveal>
        <div>
          <p class="eyebrow">&#64;sampatsaree</p>
          <h2>Styled by you</h2>
        </div>
        <a class="btn btn-outline btn-sm" href="https://www.instagram.com/sampatsaree" target="_blank" rel="noopener">
          <app-icon name="instagram" [size]="18" /> Follow us
        </a>
      </div>
      <div class="insta">
        @for (i of insta; track i; let n = $index) {
          <a href="https://www.instagram.com/sampatsaree" target="_blank" rel="noopener" [reveal]="n * 60" aria-label="Open Instagram">
            <img fade [src]="img(i, 500)" alt="" loading="lazy" />
            <span class="ov"><app-icon name="instagram" [size]="28" /></span>
          </a>
        }
      </div>
    </section>
  `,
  styles: `
    /* hero */
    .hero { position: relative; overflow: hidden; background: linear-gradient(180deg, #fff 0%, var(--bg-soft) 100%); }
    .hero-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: 56px; align-items: center; min-height: min(820px, calc(100vh - 124px)); padding-top: 48px; padding-bottom: 64px; }
    h1 { font-size: clamp(44px, 5.4vw, 80px); font-weight: 500; line-height: 1.04; letter-spacing: -.02em; margin: 20px 0 22px; }
    h1 em { font-style: italic; color: var(--accent); }
    .hero .lead { max-width: 500px; margin-bottom: 34px; }
    .cta { display: flex; gap: 12px; flex-wrap: wrap; }
    .trust { display: flex; align-items: center; gap: 16px; margin-top: 44px; }
    .avatars { display: flex; }
    .avatars img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; margin-left: -12px; box-shadow: var(--sh-1); }
    .avatars img:first-child { margin-left: 0; }
    .stars { display: flex; gap: 2px; color: #d49b1f; }
    .trust p { margin: 2px 0 0; font-size: 15px; color: var(--ink-soft); }
    .trust strong { color: var(--ink); }

    .hero-art { position: relative; height: 100%; min-height: 600px; }
    .frame { position: absolute; overflow: hidden; border-radius: var(--r-lg); box-shadow: var(--sh-3); }
    .frame img { width: 100%; height: 100%; object-fit: cover; }
    .f1 { top: 0; right: 0; width: 76%; height: 100%; border-radius: 240px 240px var(--r-lg) var(--r-lg); }
    .f2 { left: 0; bottom: 8%; width: 38%; aspect-ratio: 3/4; border: 6px solid #fff; }
    .float-card { position: absolute; left: 6%; top: 10%; display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,.96);
      backdrop-filter: blur(10px); padding: 10px 14px 10px 10px; border-radius: 18px; box-shadow: var(--sh-3); max-width: 300px;
      animation: float 6s ease-in-out infinite; transition: transform .3s; }
    .float-card img { width: 52px; height: 64px; object-fit: cover; border-radius: 10px; }
    .float-card div { display: grid; gap: 1px; }
    .fc-label { font-size: 11.5px; font-weight: 700; color: var(--accent); letter-spacing: .06em; text-transform: uppercase; }
    .float-card strong { font-size: 14.5px; font-weight: 600; line-height: 1.3; }
    .float-card em { font-style: normal; font-weight: 700; font-size: 14.5px; }
    .go { width: 32px; height: 32px; flex: none; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; }
    .since { position: absolute; right: -14px; bottom: 12%; width: 112px; height: 112px; border-radius: 50%; background: var(--accent); color: #fff;
      display: grid; place-content: center; text-align: center; box-shadow: var(--sh-3); border: 5px solid #fff; }
    .since span { font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; opacity: .85; }
    .since strong { font-family: var(--serif); font-size: 30px; font-weight: 600; line-height: 1; }
    @keyframes float { 50% { transform: translateY(-10px); } }

    /* marquee */
    .marquee { overflow: hidden; background: var(--ink); color: #f5efe6; padding: 18px 0; }
    .track { display: flex; gap: 32px; width: max-content; animation: scroll 45s linear infinite; align-items: center; }
    .track span { font-family: var(--serif); font-style: italic; font-size: 24px; white-space: nowrap; }
    .track i { color: #e7c98f; display: grid; }
    @keyframes scroll { to { transform: translateX(-50%); } }

    /* categories */
    .cats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
    .arch { aspect-ratio: 3/4; overflow: hidden; border-radius: 999px 999px var(--r-md) var(--r-md); }
    .arch img { width: 100%; height: 100%; object-fit: cover; }
    .arch img.loaded { transition: opacity .6s, transform 1.2s var(--ease); }
    .cat:hover .arch img { transform: scale(1.06); }
    .cat-meta { display: flex; justify-content: space-between; align-items: baseline; margin-top: 18px; }
    .cat h3 { font-size: 26px; }
    .cat .count { font-size: 13.5px; font-weight: 600; color: var(--ink-soft); }
    .cat p { margin: 4px 0 0; color: var(--ink-soft); font-size: 15px; }
    .cat:hover h3 { color: var(--accent); }

    /* tabs */
    .tabs { display: inline-flex; gap: 4px; padding: 5px; background: #fff; border-radius: 999px; box-shadow: var(--sh-1); }
    .tabs button { border: 0; background: none; height: 44px; padding: 0 22px; border-radius: 999px; font-weight: 600; font-size: 15px; color: var(--ink-soft); transition: background .25s, color .25s; }
    .tabs button:hover { color: var(--ink); }
    .tabs button.on { background: var(--ink); color: #fff; }
    .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px 24px; }
    .center-cta { text-align: center; margin-top: 56px; }

    /* editorial */
    .editorial { position: relative; min-height: 640px; display: flex; align-items: center; overflow: hidden; }
    .editorial > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 80% 40%; }
    .editorial::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(18,10,6,.72) 0%, rgba(18,10,6,.3) 50%, rgba(18,10,6,0) 75%); }
    .ed-wrap { position: relative; z-index: 1; }
    .ed-card { max-width: 520px; color: #fff; }
    .ed-card .eyebrow { color: #e7c98f; }
    .ed-card h2 { color: #fff; font-size: clamp(36px, 4.4vw, 60px); margin: 16px 0 18px; }
    .ed-card p { color: rgba(255,255,255,.88); font-size: 17px; margin-bottom: 32px; }
    .ed-cta { display: flex; gap: 12px; flex-wrap: wrap; }

    /* story */
    .story { display: grid; grid-template-columns: 1fr 1fr; gap: 88px; align-items: center; }
    .story-art { position: relative; padding: 0 64px 64px 0; }
    .story-art .s1 { width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: var(--r-lg); }
    .story-art .s2 { position: absolute; right: 0; bottom: 0; width: 46%; aspect-ratio: 1; object-fit: cover; border-radius: var(--r-lg); border: 8px solid #fff; box-shadow: var(--sh-3); }
    .story-text h2 { font-size: clamp(34px, 3.8vw, 52px); margin: 16px 0 20px; }
    .nums { display: flex; gap: 40px; margin: 32px 0 36px; padding: 24px 0; border-block: 1px solid var(--line); }
    .nums strong { display: block; font-family: var(--serif); font-size: 44px; font-weight: 500; line-height: 1; color: var(--accent); }
    .nums span { font-size: 14.5px; font-weight: 600; color: var(--ink-soft); }

    /* testimonials */
    .quotes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    figure { margin: 0; background: #fff; padding: 36px 32px; border-radius: var(--r-lg); box-shadow: var(--sh-1); display: flex; flex-direction: column; transition: transform .3s var(--ease), box-shadow .3s; }
    figure:hover { transform: translateY(-4px); box-shadow: var(--sh-2); }
    figure .stars { color: #d49b1f; }
    blockquote { margin: 18px 0 28px; font-family: var(--serif); font-size: 20px; line-height: 1.55; flex: 1; color: var(--ink); }
    figcaption { display: flex; align-items: center; gap: 12px; }
    .av { width: 44px; height: 44px; border-radius: 50%; background: var(--accent-soft); color: var(--accent); display: grid; place-items: center; font-weight: 700; font-size: 17px; }
    figcaption strong { display: block; font-weight: 700; }
    figcaption small { display: block; font-size: 14px; color: var(--ink-soft); }

    /* instagram */
    .insta { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
    .insta a { position: relative; aspect-ratio: 1; overflow: hidden; border-radius: var(--r-md); background: var(--bg-soft); }
    .insta img { width: 100%; height: 100%; object-fit: cover; }
    .insta img.loaded { transition: opacity .6s, transform .8s var(--ease); }
    .ov { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; background: rgba(122,31,43,.45); opacity: 0; transition: opacity .3s; }
    .insta a:hover img { transform: scale(1.08); }
    .insta a:hover .ov { opacity: 1; }

    @media (max-width: 1100px) {
      .grid4 { grid-template-columns: repeat(3, 1fr); }
      .insta { grid-template-columns: repeat(3, 1fr); }
      .hero-grid { gap: 32px; }
      .since { right: 0; }
    }
    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr; min-height: 0; padding-top: 32px; gap: 40px; }
      .hero-art { min-height: 0; height: 520px; margin-bottom: 24px; }
      .f1 { width: 80%; }
      .f2 { width: 40%; }
      .float-card { left: auto; right: 4%; top: auto; bottom: -20px; }
      .since { width: 88px; height: 88px; right: auto; left: 8%; top: 4%; bottom: auto; }
      .since strong { font-size: 24px; }
      .cats { grid-template-columns: repeat(2, 1fr); gap: 28px 16px; }
      .row-head { flex-direction: column; align-items: flex-start; }
      .grid4 { grid-template-columns: repeat(2, 1fr); gap: 32px 14px; }
      .story { grid-template-columns: 1fr; gap: 48px; }
      .quotes { grid-template-columns: 1fr; }
      .editorial { min-height: 600px; align-items: flex-end; padding-bottom: 48px; }
      .editorial::after { background: linear-gradient(0deg, rgba(18,10,6,.82) 0%, rgba(18,10,6,.35) 55%, rgba(18,10,6,0) 100%); }
    }
    @media (max-width: 560px) {
      .hero-art { height: 420px; }
      h1 { font-size: 42px; margin: 14px 0 16px; }
      .hero .lead { margin-bottom: 26px; }
      .f1 { width: 86%; border-radius: 200px 200px var(--r-lg) var(--r-lg); }
      .f2 { width: 42%; bottom: 12%; border-width: 4px; }
      .float-card { right: 0; max-width: 260px; }
      .cta .btn { flex: 1; }
      .trust { margin-top: 32px; }
      .tabs { width: 100%; }
      .tabs button { flex: 1; padding: 0 8px; font-size: 14px; }
      .cat h3 { font-size: 21px; }
      .cat .count, .cat p { font-size: 13.5px; }
      .story-art { padding: 0 32px 32px 0; }
      .nums { gap: 24px; }
      .nums strong { font-size: 36px; }
      .insta { gap: 8px; }
      figure { padding: 28px 22px; }
    }
  `,
})
export class Home {
  protected readonly img = img;
  protected readonly categories = CATEGORIES;
  protected readonly featured = PRODUCTS.find(p => p.id === 'banarasi-crimson')!;
  protected readonly weaves = ['Banarasi', 'Kanjeevaram', 'Chikankari', 'Organza', 'Bridal lehengas', 'Cotton kurtis', 'Suit materials', 'Georgette'];
  protected readonly avatars = ['photo-1770838447151-05a876cdee3d', 'photo-1692992193981-d3d92fabd9cb', 'photo-1756483560049-e7b2208f99a0', 'photo-1710967074868-2041e4f44c17'];

  protected readonly tabs: { id: Tab; label: string }[] = [
    { id: 'new', label: 'New in' }, { id: 'best', label: 'Bestsellers' }, { id: 'festive', label: 'Festive' },
  ];
  protected readonly tab = signal<Tab>('new');
  protected readonly tabProducts = computed(() => {
    const want = { new: 'New', best: 'Bestseller', festive: 'Festive' }[this.tab()];
    const tagged = PRODUCTS.filter(p => p.tag === want);
    return [...tagged, ...PRODUCTS.filter(p => p.tag !== want)].slice(0, 8);
  });
  protected countIn(slug: string) { return PRODUCTS.filter(p => p.category === slug).length; }

  // Placeholder testimonials — replace with real customer reviews before going live.
  protected readonly quotes = [
    { name: 'Priya S.', where: 'Bride, 2025', text: 'Bought my wedding Banarasi here, just like my mother did. The quality is unmatched and the family treats you like their own.' },
    { name: 'Neha J.', where: 'Regular customer', text: 'Their kurti collection is my go-to for office wear. Comfortable fabric, beautiful prints and honest prices.' },
    { name: 'Ritu A.', where: 'Sangeet shopping', text: "The staff helped me pick the perfect lehenga for my sister's sangeet. Everyone asked where it was from!" },
  ];
  protected readonly insta = [
    'photo-1710967074868-2041e4f44c17', 'photo-1770838447151-05a876cdee3d', 'photo-1600685890506-593fdf55949b',
    'photo-1692992193981-d3d92fabd9cb', 'photo-1756483560049-e7b2208f99a0', 'photo-1739429942851-9083ee185d3d',
  ];
}
