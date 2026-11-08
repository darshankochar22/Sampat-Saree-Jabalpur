import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home').then(m => m.Home), title: 'Sampat Saree Emporium — Ethnic Wear Since 1952' },
  { path: 'shop', loadComponent: () => import('./pages/shop').then(m => m.Shop), title: 'Shop — Sampat Saree Emporium' },
  { path: 'product/:id', loadComponent: () => import('./pages/product').then(m => m.ProductPage), title: 'Sampat Saree Emporium' },
  { path: 'cart', loadComponent: () => import('./pages/cart').then(m => m.CartPage), title: 'Your Bag — Sampat' },
  { path: 'checkout', loadComponent: () => import('./pages/checkout').then(m => m.Checkout), title: 'Checkout — Sampat' },
  { path: 'wishlist', loadComponent: () => import('./pages/wishlist').then(m => m.Wishlist), title: 'Wishlist — Sampat' },
  { path: 'about', loadComponent: () => import('./pages/about').then(m => m.About), title: 'Our Story — Sampat' },
  { path: 'contact', loadComponent: () => import('./pages/contact').then(m => m.Contact), title: 'Visit Us — Sampat' },
  { path: '**', redirectTo: '' },
];
