import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { img } from '../data/products';
import { InrPipe } from '../components/inr.pipe';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, InrPipe, Icon],
  template: `
    <section class="container page">
      @if (orderId(); as id) {
        <div class="done fade-up">
          <div class="tick"><app-icon name="check" [size]="40" [stroke]="2.4" /></div>
          <h1>Thank you, {{ placedName() }}!</h1>
          <p>Your order <strong>#{{ id }}</strong> has been placed. We'll call you on <strong>{{ placedPhone() }}</strong> to confirm the details and delivery.</p>
          <div class="done-cta">
            <a class="btn btn-primary" routerLink="/shop">Continue shopping <app-icon name="arrow" class="arrow" /></a>
            <a class="btn btn-outline" routerLink="/">Back to home</a>
          </div>
        </div>
      } @else if (!cart.items().length) {
        <div class="done">
          <h1>Your bag is empty</h1>
          <p>Add something you love, then come back here to check out.</p>
          <a class="btn btn-primary" routerLink="/shop">Start shopping <app-icon name="arrow" class="arrow" /></a>
        </div>
      } @else {
        <header class="ph">
          <h1>Checkout</h1>
          <ol class="steps"><li class="on">Bag</li><li class="on">Details</li><li>Confirmation</li></ol>
        </header>
        <div class="layout">
          <form [formGroup]="form" (ngSubmit)="place()" novalidate>
            <fieldset>
              <legend><span>1</span> Contact</legend>
              <div class="two">
                <div class="field">
                  <label for="name">Full name</label>
                  <input id="name" formControlName="name" autocomplete="name" [class.invalid]="bad('name')" />
                  @if (bad('name')) { <span class="field-err">Please enter your name</span> }
                </div>
                <div class="field">
                  <label for="phone">Mobile number</label>
                  <div class="prefix"><span>+91</span><input id="phone" formControlName="phone" inputmode="numeric" maxlength="10" autocomplete="tel-national" [class.invalid]="bad('phone')" /></div>
                  @if (bad('phone')) { <span class="field-err">Enter a valid 10-digit mobile number</span> }
                </div>
              </div>
              <div class="field">
                <label for="email">Email <small>(optional)</small></label>
                <input id="email" type="email" formControlName="email" autocomplete="email" [class.invalid]="bad('email')" />
                @if (bad('email')) { <span class="field-err">That email doesn't look right</span> }
              </div>
            </fieldset>

            <fieldset>
              <legend><span>2</span> Delivery address</legend>
              <div class="field">
                <label for="address">House no., street, area</label>
                <textarea id="address" rows="3" formControlName="address" autocomplete="street-address" [class.invalid]="bad('address')"></textarea>
                @if (bad('address')) { <span class="field-err">Please enter your address</span> }
              </div>
              <div class="three">
                <div class="field">
                  <label for="city">City</label>
                  <input id="city" formControlName="city" autocomplete="address-level2" [class.invalid]="bad('city')" />
                  @if (bad('city')) { <span class="field-err">Required</span> }
                </div>
                <div class="field">
                  <label for="state">State</label>
                  <input id="state" formControlName="state" autocomplete="address-level1" [class.invalid]="bad('state')" />
                  @if (bad('state')) { <span class="field-err">Required</span> }
                </div>
                <div class="field">
                  <label for="pin">PIN code</label>
                  <input id="pin" formControlName="pin" inputmode="numeric" maxlength="6" autocomplete="postal-code" [class.invalid]="bad('pin')" />
                  @if (bad('pin')) { <span class="field-err">6-digit PIN</span> }
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend><span>3</span> Payment</legend>
              <div class="pay">
                <label class="opt" [class.on]="form.value.payment === 'cod'">
                  <input type="radio" value="cod" formControlName="payment" />
                  <app-icon name="cash" />
                  <span><strong>Cash on delivery</strong><small>Pay in cash when your order arrives</small></span>
                </label>
                <label class="opt" [class.on]="form.value.payment === 'upi'">
                  <input type="radio" value="upi" formControlName="payment" />
                  <app-icon name="phone" />
                  <span><strong>UPI</strong><small>We'll share a UPI link on the confirmation call</small></span>
                </label>
              </div>
            </fieldset>

            <button class="btn btn-accent btn-lg btn-block" type="submit">
              Place order · {{ cart.total() | inr }}
            </button>
            <p class="secure"><app-icon name="shield" [size]="16" /> Your details are only used to deliver this order.</p>
          </form>

          <aside class="summary">
            <h2>Order summary</h2>
            <div class="items">
              @for (i of cart.items(); track i.product.id) {
                <div class="it">
                  <div class="thumb"><img [src]="img(i.product.images[0], 160)" [alt]="i.product.name" /><span>{{ i.qty }}</span></div>
                  <p>{{ i.product.name }}</p>
                  <strong>{{ i.product.price * i.qty | inr }}</strong>
                </div>
              }
            </div>
            <div class="r"><span>Subtotal</span><span>{{ cart.subtotal() | inr }}</span></div>
            <div class="r"><span>Shipping</span><span>{{ cart.shipping() ? (cart.shipping() | inr) : 'Free' }}</span></div>
            <div class="r total"><span>Total</span><span>{{ cart.total() | inr }}</span></div>
          </aside>
        </div>
      }
    </section>
  `,
  styles: `
    .page { padding-top: 56px; padding-bottom: 112px; }
    .ph { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }
    .ph h1 { font-size: clamp(40px, 5vw, 56px); }
    .steps { display: flex; gap: 8px; list-style: none; margin: 0; padding: 0; counter-reset: s; }
    .steps li { counter-increment: s; display: flex; align-items: center; gap: 8px; font-size: 14.5px; font-weight: 600; color: var(--ink-soft); }
    .steps li::before { content: counter(s); width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; background: var(--bg-tint); }
    .steps li.on { color: var(--ink); }
    .steps li.on::before { background: var(--ink); color: #fff; }
    .steps li + li::after { content: none; }
    .steps li:not(:last-child)::after { content: ''; width: 24px; height: 1.5px; background: var(--line-strong); margin-left: 4px; }
    .layout { display: grid; grid-template-columns: 1fr 420px; gap: 56px; align-items: start; }
    form { display: grid; gap: 24px; }
    fieldset { border: 1.5px solid var(--line); border-radius: var(--r-lg); padding: 28px; margin: 0; display: grid; gap: 18px; }
    legend { display: flex; align-items: center; gap: 12px; padding: 0 8px; margin-left: -8px; font-family: var(--serif); font-size: 24px; }
    legend span { width: 30px; height: 30px; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; font-family: var(--sans); font-size: 14px; font-weight: 700; }
    label small { font-weight: 500; color: var(--ink-soft); }
    .two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .three { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .prefix { position: relative; }
    .prefix span { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-weight: 600; color: var(--ink-soft); }
    .prefix input { padding-left: 54px; }
    .pay { display: grid; gap: 12px; }
    .opt { display: flex; align-items: center; gap: 14px; border: 1.5px solid var(--line-strong); border-radius: var(--r-md); padding: 18px; cursor: pointer; transition: border-color .2s, background .2s; }
    .opt:hover { border-color: var(--ink-soft); }
    .opt.on { border-color: var(--ink); background: var(--bg-soft); }
    .opt input { width: 20px; height: 20px; min-height: 0; accent-color: var(--accent); margin: 0; }
    .opt app-icon { color: var(--accent); }
    .opt span { display: grid; }
    .opt strong { font-weight: 700; }
    .opt small { color: var(--ink-soft); font-size: 14px; }
    .secure { display: flex; justify-content: center; align-items: center; gap: 8px; margin: -8px 0 0; font-size: 14px; color: var(--ink-soft); }
    .summary { background: var(--bg-soft); padding: 32px; border-radius: var(--r-lg); display: grid; gap: 14px; position: sticky; top: 96px; }
    .summary h2 { font-size: 26px; }
    .items { display: grid; gap: 16px; padding: 8px 0 16px; border-bottom: 1px solid var(--line-strong); }
    .it { display: grid; grid-template-columns: 64px 1fr auto; gap: 14px; align-items: center; }
    .it p { margin: 0; font-weight: 600; font-size: 15px; line-height: 1.35; }
    .it strong { font-weight: 700; }
    .thumb { position: relative; }
    .thumb img { width: 64px; height: 84px; object-fit: cover; border-radius: 10px; }
    .thumb span { position: absolute; top: -8px; right: -8px; min-width: 24px; height: 24px; border-radius: 12px; background: var(--ink); color: #fff; font-size: 12.5px; font-weight: 700; display: grid; place-items: center; border: 2px solid var(--bg-soft); }
    .r { display: flex; justify-content: space-between; color: var(--ink-2); }
    .total { border-top: 1px solid var(--line-strong); padding-top: 16px; font-size: 20px; font-weight: 700; color: var(--ink); }
    .done { text-align: center; max-width: 560px; margin: 0 auto; padding: 40px 0; display: grid; justify-items: center; }
    .tick { width: 96px; height: 96px; border-radius: 50%; background: #e3f2e9; color: var(--success); display: grid; place-items: center; margin-bottom: 24px; animation: pop .6s var(--ease) both; }
    @keyframes pop { from { transform: scale(.5); opacity: 0; } }
    .done h1 { font-size: clamp(36px, 4.4vw, 52px); }
    .done p { color: var(--ink-soft); font-size: 17px; margin: 16px 0 32px; }
    .done strong { color: var(--ink); }
    .done-cta { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
    @media (max-width: 960px) {
      .layout { grid-template-columns: 1fr; gap: 32px; }
      .summary { position: static; order: -1; }
    }
    @media (max-width: 600px) {
      .page { padding-top: 32px; }
      .two, .three { grid-template-columns: 1fr; }
      fieldset { padding: 20px 16px; }
      .summary { padding: 24px 20px; }
      .steps { display: none; }
    }
  `,
})
export class Checkout {
  protected readonly cart = inject(CartService);
  protected readonly img = img;
  protected readonly orderId = signal<string | null>(null);
  protected readonly placedName = signal('');
  protected readonly placedPhone = signal('');

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    email: ['', Validators.email],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pin: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    payment: ['cod'],
  });

  protected bad(name: keyof typeof this.form.controls) {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  place() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      document.querySelector<HTMLElement>('input.ng-invalid, textarea.ng-invalid')?.focus();
      return;
    }
    const v = this.form.getRawValue();
    this.placedName.set(v.name.split(' ')[0]);
    this.placedPhone.set('+91 ' + v.phone);
    this.orderId.set('SS' + Date.now().toString().slice(-6));
    this.cart.clear();
    window.scrollTo({ top: 0 });
  }
}
