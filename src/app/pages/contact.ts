import { Component, signal } from '@angular/core';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-contact',
  imports: [Icon],
  template: `
    <section class="container page">
      <div class="head">
        <p class="eyebrow center fade-up">Visit us</p>
        <h1 class="fade-up" style="--d: 80ms">Come, sit, and choose at your own pace</h1>
        <p class="lead fade-up" style="--d: 160ms">Our team is happy to help — in store, on a call, or over a video call for out-of-town customers.</p>
      </div>
      <div class="layout">
        <div class="cards">
          <div class="card"><span class="ic"><app-icon name="pin" /></span><div><h3>Store</h3><p>Sampat Saree Emporium<br />Main Road<br /><em>Full address &amp; PIN to be added</em></p></div></div>
          <div class="card"><span class="ic"><app-icon name="clock" /></span><div><h3>Opening hours</h3><p>Monday – Sunday<br />10:30 am – 9:00 pm <em>(to confirm)</em></p></div></div>
          <div class="card"><span class="ic"><app-icon name="phone" /></span><div><h3>Call us</h3><p><em>Phone number to be added</em></p></div></div>
          <a class="card link" href="https://www.instagram.com/sampatsaree" target="_blank" rel="noopener">
            <span class="ic"><app-icon name="instagram" /></span><div><h3>Instagram</h3><p>&#64;sampatsaree — DM us for new arrivals</p></div>
            <app-icon name="arrow" [size]="18" class="go" />
          </a>
        </div>

        <form (submit)="$event.preventDefault(); sent.set(true)">
          @if (!sent()) {
            <h2>Send us a message</h2>
            <div class="two">
              <div class="field"><label for="n">Your name</label><input id="n" required autocomplete="name" /></div>
              <div class="field"><label for="p">Phone</label><input id="p" required inputmode="numeric" autocomplete="tel" /></div>
            </div>
            <div class="field">
              <label for="t">I'm looking for</label>
              <select id="t"><option>A bridal saree or lehenga</option><option>Everyday kurtis or suits</option><option>A video-call shopping session</option><option>Something else</option></select>
            </div>
            <div class="field"><label for="m">Message</label><textarea id="m" rows="5" placeholder="Tell us about the occasion, colours you love, or your budget…"></textarea></div>
            <button class="btn btn-primary btn-lg btn-block" type="submit">Send message <app-icon name="arrow" class="arrow" /></button>
          } @else {
            <div class="sent">
              <div class="tick"><app-icon name="check" [size]="36" [stroke]="2.4" /></div>
              <h2>Thank you!</h2>
              <p>We've received your message and will get back to you soon.</p>
            </div>
          }
        </form>
      </div>
    </section>
  `,
  styles: `
    .page { padding-top: 80px; padding-bottom: 112px; }
    .head { text-align: center; max-width: 760px; margin: 0 auto 56px; }
    h1 { font-size: clamp(38px, 4.8vw, 64px); margin: 16px 0 18px; }
    .layout { display: grid; grid-template-columns: 1fr 1.15fr; gap: 40px; align-items: start; }
    .cards { display: grid; gap: 14px; }
    .card { display: flex; gap: 18px; align-items: flex-start; padding: 24px; border: 1.5px solid var(--line); border-radius: var(--r-lg); transition: border-color .2s, transform .2s; }
    .card.link:hover { border-color: var(--ink); transform: translateY(-2px); }
    .ic { width: 50px; height: 50px; border-radius: 50%; background: var(--accent-soft); color: var(--accent); display: grid; place-items: center; flex: none; }
    .card > div { flex: 1; }
    .card h3 { font-family: var(--sans); font-size: 16px; font-weight: 700; margin-bottom: 4px; }
    .card p { margin: 0; color: var(--ink-soft); }
    .card em { font-style: normal; color: var(--gold); font-weight: 600; font-size: 14px; }
    .go { align-self: center; }
    form { display: grid; gap: 18px; background: var(--bg-soft); padding: 40px; border-radius: var(--r-lg); }
    form h2 { font-size: 30px; margin-bottom: 4px; }
    .two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .sent { text-align: center; padding: 48px 0; display: grid; justify-items: center; }
    .tick { width: 84px; height: 84px; border-radius: 50%; background: #e3f2e9; color: var(--success); display: grid; place-items: center; margin-bottom: 20px; }
    .sent p { color: var(--ink-soft); margin: 10px 0 0; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .page { padding-top: 48px; } }
    @media (max-width: 560px) { form { padding: 24px 18px; } .two { grid-template-columns: 1fr; } }
  `,
})
export class Contact {
  protected readonly sent = signal(false);
}
