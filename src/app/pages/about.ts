import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { img } from '../data/products';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal.directive';
import { ImgFade } from '../shared/img-fade.directive';

@Component({
  selector: 'app-about',
  imports: [RouterLink, Icon, Reveal, ImgFade],
  template: `
    <section class="intro container">
      <p class="eyebrow center fade-up">Our story</p>
      <h1 class="fade-up" style="--d: 80ms">Seventy-four years of <em>dressing our town</em></h1>
      <p class="lead fade-up" style="--d: 160ms">Sampat Saree Emporium opened its doors on Main Road in 1952 with a single promise: honest fabric at an honest price. Three generations later, that promise — and that counter — are still here.</p>
    </section>

    <div class="container"><div class="wide skeleton"><img fade [src]="img('photo-1717585679395-bbe39b5fb6bc', 1800)" alt="Folded fabrics on a table in the shop" /></div></div>

    <section class="section container">
      <div class="section-head" reveal><p class="eyebrow center">Through the years</p><h2>A story told in silk</h2></div>
      <ol class="timeline">
        @for (b of beats; track b.year; let i = $index) {
          <li [reveal]="i * 120">
            <span class="yr">{{ b.year }}</span>
            <h3>{{ b.title }}</h3>
            <p>{{ b.text }}</p>
          </li>
        }
      </ol>
    </section>

    <section class="section soft">
      <div class="container values">
        @for (v of values; track v.title; let i = $index) {
          <div [reveal]="i * 100">
            <span class="ic"><app-icon [name]="v.icon" [size]="26" /></span>
            <h3>{{ v.title }}</h3>
            <p>{{ v.text }}</p>
          </div>
        }
      </div>
    </section>

    <section class="quote container" reveal>
      <p>“A saree is not bought — it is <em>chosen</em>.”</p>
      <span>— The Sampat family</span>
      <div class="cta">
        <a class="btn btn-primary btn-lg" routerLink="/shop">Shop the collection <app-icon name="arrow" class="arrow" /></a>
        <a class="btn btn-outline btn-lg" routerLink="/contact">Visit the store</a>
      </div>
    </section>
  `,
  styles: `
    .intro { text-align: center; padding-top: 88px; padding-bottom: 56px; max-width: 880px; }
    h1 { font-size: clamp(42px, 5.6vw, 76px); margin: 18px 0 24px; letter-spacing: -.02em; }
    h1 em { color: var(--accent); }
    .intro .lead { max-width: 680px; margin: 0 auto; }
    .wide { border-radius: var(--r-lg); overflow: hidden; }
    .wide img { width: 100%; height: 520px; object-fit: cover; }
    .timeline { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; position: relative; }
    .timeline::before { content: ''; position: absolute; top: 34px; left: 0; right: 0; height: 1.5px; background: var(--line-strong); }
    .timeline li { position: relative; padding-top: 72px; }
    .timeline li::before { content: ''; position: absolute; top: 26px; left: 0; width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 3px solid var(--accent); }
    .yr { font-family: var(--serif); font-size: 52px; font-weight: 500; color: var(--accent); line-height: 1; }
    .timeline h3 { font-size: 26px; margin: 14px 0 10px; }
    .timeline p { color: var(--ink-soft); margin: 0; font-size: 16.5px; }
    .values { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .values > div { background: #fff; padding: 36px 32px; border-radius: var(--r-lg); box-shadow: var(--sh-1); }
    .ic { width: 56px; height: 56px; border-radius: 50%; background: var(--accent-soft); color: var(--accent); display: grid; place-items: center; margin-bottom: 20px; }
    .values h3 { font-size: 24px; margin-bottom: 10px; }
    .values p { color: var(--ink-soft); margin: 0; }
    .quote { text-align: center; padding-top: 112px; padding-bottom: 120px; }
    .quote p { font-family: var(--serif); font-size: clamp(34px, 4.6vw, 60px); line-height: 1.2; margin: 0 auto 16px; max-width: 860px; }
    .quote em { color: var(--accent); }
    .quote span { font-weight: 600; color: var(--ink-soft); }
    .cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 40px; }
    @media (max-width: 860px) {
      .intro { padding-top: 56px; }
      .wide img { height: 320px; }
      .timeline, .values { grid-template-columns: 1fr; }
      .timeline::before { top: 0; bottom: 0; left: 8px; right: auto; width: 1.5px; height: auto; }
      .timeline li { padding: 0 0 0 44px; }
      .timeline li::before { top: 14px; }
      .quote { padding-top: 72px; padding-bottom: 80px; }
    }
  `,
})
export class About {
  protected readonly img = img;
  protected readonly beats = [
    { year: '1952', title: 'The first counter', text: 'A small shop of handloom cottons and silks opens on Main Road.' },
    { year: '1980s', title: 'The bridal years', text: 'Banarasi and Kanjeevaram silks make Sampat the name families trust for weddings.' },
    { year: 'Today', title: 'A new generation', text: 'Suits, kurtis and lehengas join the sarees — and now our collection comes to you online.' },
  ];
  protected readonly values = [
    { icon: 'sparkle', title: 'Chosen by hand', text: 'Every weave is picked by our family for its quality, drape and finish.' },
    { icon: 'shield', title: 'Honest pricing', text: 'Fair prices with no inflated discounts — the same promise since day one.' },
    { icon: 'heart', title: 'Like family', text: 'Take your time. Try it on. We would rather you love it than rush it.' },
  ];
}
