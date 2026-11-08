import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PRODUCTS, CATEGORIES, img } from '../data/products';
import { UiService } from '../services/ui.service';
import { InrPipe } from './inr.pipe';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-search-overlay',
  imports: [RouterLink, InrPipe, Icon],
  host: { '(document:keydown)': 'onKey($event)' },
  template: `
    @if (ui.searchOpen()) {
      <div class="scrim" (click)="close()"></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Search">
        <div class="container">
          <form class="bar" (submit)="$event.preventDefault(); submit()">
            <app-icon name="search" [size]="24" />
            <input #box type="search" placeholder="Search for sarees, silk, lehengas…" [value]="q()"
                   (input)="q.set($any($event.target).value)" aria-label="Search products" autocomplete="off" />
            <button type="button" class="icon-btn" (click)="close()" aria-label="Close search"><app-icon name="close" /></button>
          </form>

          @if (!q().trim()) {
            <p class="label">Popular searches</p>
            <div class="pop">
              @for (t of popular; track t) { <button class="chip" (click)="q.set(t)">{{ t }}</button> }
            </div>
            <p class="label">Shop by category</p>
            <div class="cats">
              @for (c of categories; track c.slug) {
                <a [routerLink]="['/shop']" [queryParams]="{ c: c.slug }" (click)="close()">
                  <img [src]="img(c.image, 200)" alt="" /><span>{{ c.name }}</span>
                </a>
              }
            </div>
          } @else if (results().length) {
            <p class="label">{{ results().length }} {{ results().length === 1 ? 'result' : 'results' }}</p>
            <div class="results">
              @for (p of results(); track p.id) {
                <a [routerLink]="['/product', p.id]" (click)="close()">
                  <img [src]="img(p.images[0], 200)" [alt]="p.name" />
                  <div><strong>{{ p.name }}</strong><span>{{ p.fabric }}</span><em>{{ p.price | inr }}</em></div>
                </a>
              }
            </div>
            <button class="text-link" (click)="submit()">See all results <app-icon name="arrow" [size]="16" /></button>
          } @else {
            <p class="none">No matches for “{{ q() }}”. Try “silk” or “kurti”.</p>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .scrim { position: fixed; inset: 0; background: rgba(20,18,16,.4); z-index: 150; animation: fade .25s both; }
    .panel { position: fixed; top: 0; left: 0; right: 0; z-index: 160; background: #fff; padding: 20px 0 36px; box-shadow: var(--sh-3);
      border-radius: 0 0 var(--r-lg) var(--r-lg); max-height: 88vh; overflow-y: auto; animation: drop .35s var(--ease) both; }
    .bar { display: flex; align-items: center; gap: 14px; border-bottom: 2px solid var(--ink); padding: 6px 0 10px; }
    .bar input { border: 0; box-shadow: none; padding: 0; font-family: var(--serif); font-size: clamp(22px, 3vw, 32px); min-height: 56px; }
    .bar input:focus { box-shadow: none; }
    .label { margin: 28px 0 14px; font-size: 13px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); }
    .pop { display: flex; flex-wrap: wrap; gap: 10px; }
    .cats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .cats a { display: flex; align-items: center; gap: 14px; padding: 10px; border-radius: var(--r-md); border: 1.5px solid var(--line); font-weight: 600; transition: border-color .2s; }
    .cats a:hover { border-color: var(--ink); }
    .cats img { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; }
    .results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
    .results a { display: flex; gap: 14px; padding: 10px; border-radius: var(--r-md); transition: background .2s; }
    .results a:hover { background: var(--bg-soft); }
    .results img { width: 64px; height: 84px; border-radius: 10px; object-fit: cover; }
    .results div { display: grid; align-content: center; gap: 2px; }
    .results strong { font-weight: 600; line-height: 1.3; }
    .results span { font-size: 14px; color: var(--ink-soft); }
    .results em { font-style: normal; font-weight: 700; }
    .text-link { border: 0; background: none; }
    .none { margin: 32px 0 8px; font-size: 17px; color: var(--ink-soft); }
    @keyframes fade { from { opacity: 0; } }
    @keyframes drop { from { opacity: 0; transform: translateY(-16px); } }
    @media (max-width: 860px) { .cats { grid-template-columns: repeat(2, 1fr); } .results { grid-template-columns: 1fr; } }
  `,
})
export class SearchOverlay {
  protected readonly ui = inject(UiService);
  private readonly router = inject(Router);
  protected readonly img = img;
  protected readonly categories = CATEGORIES;
  protected readonly popular = ['Banarasi', 'Kanjeevaram', 'Bridal', 'Chikankari', 'Cotton kurti', 'Organza'];
  protected readonly q = signal('');
  private readonly box = viewChild<ElementRef<HTMLInputElement>>('box');

  protected readonly results = computed(() => {
    const words = this.q().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return PRODUCTS.filter(p => {
      const hay = `${p.name} ${p.fabric} ${p.category} ${p.description}`.toLowerCase();
      return words.every(w => hay.includes(w));
    }).slice(0, 6);
  });

  constructor() {
    effect(() => {
      const open = this.ui.searchOpen();
      if (open) setTimeout(() => this.box()?.nativeElement.focus(), 30);
    });
  }

  close() { this.ui.searchOpen.set(false); this.q.set(''); }
  submit() {
    const q = this.q().trim();
    this.close();
    this.router.navigate(['/shop'], { queryParams: q ? { q } : {} });
  }
  onKey(e: KeyboardEvent) {
    const t = e.target as HTMLElement;
    const typing = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable;
    if (e.key === 'Escape' && this.ui.searchOpen()) this.close();
    else if (e.key === '/' && !typing && !this.ui.searchOpen()) { e.preventDefault(); this.ui.searchOpen.set(true); }
  }
}
