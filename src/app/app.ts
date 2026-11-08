import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { CartDrawer } from './components/cart-drawer';
import { SearchOverlay } from './components/search-overlay';
import { Toasts } from './components/toasts';
import { BackToTop } from './components/back-to-top';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CartDrawer, SearchOverlay, Toasts, BackToTop],
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <app-header />
    <main id="main" tabindex="-1"><router-outlet /></main>
    <app-footer />
    <app-cart-drawer />
    <app-search-overlay />
    <app-toasts />
    <app-back-to-top />
  `,
  styles: `main { min-height: 60vh; outline: none; }`,
})
export class App {}
