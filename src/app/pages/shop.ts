import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CATEGORIES, Category, PRODUCTS, img } from '../data/products';
import { ProductCard } from '../components/product-card';
import { Icon } from '../shared/icon';
import { InrPipe } from '../components/inr.pipe';

type Sort = 'featured' | 'low' | 'high' | 'discount';
const PRICES = [
  { v: 0, label: 'Any price' }, { v: 2000, label: 'Under ₹2,000' }, { v: 5000, label: 'Under ₹5,000' },
  { v: 15000, label: 'Under ₹15,000' }, { v: 30000, label: 'Under ₹30,000' },
];

@Component({
  selector: 'app-shop',
  imports: [ProductCard, RouterLink, Icon, InrPipe],
  template: `
    <section class="banner">
      @if (bannerImg(); as b) { <img [src]="img(b, 1800)" alt="" class="bg" /> }
      <div class="container banner-in">
        <nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a><app-icon name="chevron" [size]="14" /><span>{{ title() }}</span></nav>
        <h1>{{ title() }}</h1>
        <p>{{ blurb() }}</p>
      </div>
    </section>

    <div class="container">
      <div class="chips" role="tablist" aria-label="Categories">
        <button class="chip" [class.on]="!category()" (click)="setCat(null)">All <span class="n">{{ total }}</span></button>
        @for (c of categories; track c.slug) {
          <button class="chip" [class.on]="category() === c.slug" (click)="setCat(c.slug)">{{ c.name }} <span class="n">{{ countIn(c.slug) }}</span></button>
        }
      </div>

      <div class="toolbar">
        <label class="search">
          <app-icon name="search" [size]="20" />
          <input type="search" placeholder="Search in {{ title().toLowerCase() }}…" [value]="query()" (input)="query.set($any($event.target).value)" aria-label="Search products" />
        </label>
        <div class="selects">
          <label class="sel"><span class="vh">Price</span>
            <select [value]="maxPrice()" (change)="maxPrice.set(+$any($event.target).value)">
              @for (p of prices; track p.v) { <option [value]="p.v">{{ p.label }}</option> }
            </select>
          </label>
          <label class="sel"><span class="vh">Sort by</span>
            <select [value]="sort()" (change)="sort.set($any($event.target).value)">
              <option value="featured">Sort: Featured</option>
              <option value="low">Price: Low to high</option>
              <option value="high">Price: High to low</option>
              <option value="discount">Biggest discount</option>
            </select>
          </label>
        </div>
      </div>

      <div class="status">
        <p><strong>{{ results().length }}</strong> {{ results().length === 1 ? 'style' : 'styles' }}</p>
        @if (hasFilters()) {
          <div class="active">
            @if (query().trim()) { <button (click)="query.set('')">“{{ query() }}” <app-icon name="close" [size]="14" /></button> }
            @if (maxPrice()) { <button (click)="maxPrice.set(0)">Under {{ maxPrice() | inr }} <app-icon name="close" [size]="14" /></button> }
            <button class="clear" (click)="reset()">Clear all</button>
          </div>
        }
      </div>

      @if (results().length) {
        <div class="grid">
          @for (p of results(); track p.id; let i = $index) {
            <app-product-card [product]="p" class="fade-up" [style.--d]="(i % 8) * 50 + 'ms'" />
          }
        </div>
      } @else {
        <div class="empty">
          <div class="circle"><app-icon name="search" [size]="32" [stroke]="1.4" /></div>
          <h2>No styles found</h2>
          <p>Try a different word, or clear your filters to see everything.</p>
          <button class="btn btn-primary" (click)="reset()">Clear filters</button>
        </div>
      }
    </div>
  `,
  styles: `
    .banner { position: relative; overflow: hidden; background: var(--bg-soft); }
    .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; }
    .banner::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,255,255,.97) 0%, rgba(255,255,255,.9) 45%, rgba(255,255,255,.25) 100%); }
    .banner-in { position: relative; z-index: 1; padding-top: 56px; padding-bottom: 56px; }
    .crumbs { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--ink-soft); }
    .crumbs a:hover { color: var(--accent); }
    h1 { font-size: clamp(42px, 5vw, 68px); margin: 14px 0 10px; }
    .banner p { max-width: 460px; font-size: 17px; color: var(--ink-2); margin: 0; }
    .chips { display: flex; flex-wrap: wrap; gap: 10px; margin: 36px 0 24px; }
    .toolbar { display: flex; justify-content: space-between; gap: 16px; align-items: center; }
    .search { position: relative; flex: 1; max-width: 420px; display: block; }
    .search app-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--ink-soft); pointer-events: none; }
    .search input { padding-left: 48px; border-radius: 999px; }
    .selects { display: flex; gap: 10px; }
    .sel select { border-radius: 999px; min-width: 200px; font-weight: 600; }
    .vh { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    .status { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin: 24px 0 28px; padding-bottom: 20px; border-bottom: 1px solid var(--line); min-height: 58px; }
    .status p { margin: 0; color: var(--ink-soft); }
    .status strong { color: var(--ink); }
    .active { display: flex; gap: 8px; flex-wrap: wrap; }
    .active button { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: 999px; border: 0; background: var(--bg-tint); font-size: 14px; font-weight: 600; }
    .active button:hover { background: var(--accent-soft); color: var(--accent); }
    .active .clear { background: none; text-decoration: underline; text-underline-offset: 3px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 44px 24px; padding-bottom: 112px; }
    .empty { text-align: center; padding: 56px 0 120px; display: grid; justify-items: center; }
    .circle { width: 84px; height: 84px; border-radius: 50%; background: var(--bg-soft); display: grid; place-items: center; color: var(--accent); margin-bottom: 18px; }
    .empty h2 { font-size: 32px; }
    .empty p { color: var(--ink-soft); margin: 10px 0 24px; }
    @media (max-width: 1100px) { .grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 800px) {
      .banner::after { background: linear-gradient(90deg, rgba(255,255,255,.96), rgba(255,255,255,.82)); }
      .banner-in { padding-top: 36px; padding-bottom: 36px; }
      .chips { flex-wrap: nowrap; overflow-x: auto; margin: 24px -16px 18px; padding: 0 16px 4px; scrollbar-width: none; }
      .chips .chip { flex: none; }
      .toolbar { flex-direction: column; align-items: stretch; }
      .search { max-width: none; }
      .selects .sel { flex: 1; }
      .sel select { min-width: 0; }
      .grid { grid-template-columns: repeat(2, 1fr); gap: 32px 14px; padding-bottom: 80px; }
    }
  `,
})
export class Shop {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly img = img;
  protected readonly categories = CATEGORIES;
  protected readonly prices = PRICES;
  protected readonly total = PRODUCTS.length;

  private readonly params = toSignal(this.route.queryParamMap);
  protected readonly category = computed(() => (this.params()?.get('c') as Category) || null);
  protected readonly query = signal('');
  protected readonly sort = signal<Sort>('featured');
  protected readonly maxPrice = signal(0);

  private readonly cat = computed(() => CATEGORIES.find(c => c.slug === this.category()));
  protected readonly title = computed(() => this.cat()?.name ?? 'Shop all');
  protected readonly blurb = computed(() => this.cat()?.blurb ?? 'Every saree, suit, kurti and lehenga in our collection.');
  protected readonly bannerImg = computed(() => this.cat()?.image ?? 'photo-1717585679395-bbe39b5fb6bc');
  protected readonly hasFilters = computed(() => !!this.query().trim() || !!this.maxPrice());

  constructor() {
    // Accept ?q= from the header search.
    effect(() => { const q = this.params()?.get('q'); if (q) this.query.set(q); });
  }

  protected readonly results = computed(() => {
    const words = this.query().toLowerCase().split(/\s+/).filter(Boolean);
    const cat = this.category();
    const max = this.maxPrice();
    let list = PRODUCTS.filter(p => {
      const hay = `${p.name} ${p.fabric} ${p.category} ${p.description}`.toLowerCase();
      return (!cat || p.category === cat) && (!max || p.price <= max) && words.every(w => hay.includes(w));
    });
    const by = { low: (a: any, b: any) => a.price - b.price, high: (a: any, b: any) => b.price - a.price,
                 discount: (a: any, b: any) => a.price / a.mrp - b.price / b.mrp } as const;
    const s = this.sort();
    if (s !== 'featured') list = [...list].sort(by[s]);
    return list;
  });

  protected countIn(slug: string) { return PRODUCTS.filter(p => p.category === slug).length; }
  setCat(c: Category | null) { this.router.navigate([], { queryParams: { c, q: null }, queryParamsHandling: 'merge', replaceUrl: true }); }
  reset() { this.query.set(''); this.maxPrice.set(0); this.sort.set('featured'); this.router.navigate([], { queryParams: {}, replaceUrl: true }); }
}
