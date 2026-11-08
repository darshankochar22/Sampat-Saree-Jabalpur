import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

const PATHS: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
  heart: '<path d="M12 20.3s-7.6-4.6-9.6-9.4C.9 7.3 3.2 3.8 6.8 3.8c2.1 0 3.9 1.2 5.2 3 1.3-1.8 3.1-3 5.2-3 3.6 0 5.9 3.5 4.4 7.1-2 4.8-9.6 9.4-9.6 9.4z"/>',
  bag: '<path d="M5.5 8h13l-1 12.2a1 1 0 01-1 .8H7.5a1 1 0 01-1-.8L5.5 8z"/><path d="M9 10V6.8a3 3 0 016 0V10"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  'arrow-up': '<path d="M12 20V5M6 11l6-6 6 6"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  'chevron-down': '<path d="M6 9l6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  truck: '<path d="M3 6.5h11v9H3zM14 9.5h4l3 3.2v2.8h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  refresh: '<path d="M20 11a8 8 0 00-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0014.3 4.9L20 16M20 20v-4h-4"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6L12 3z"/><path d="M8.8 12l2.2 2.2 4.4-4.4"/>',
  cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 005.2 5.2l1.3-2 4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 014.5 5.7a2 2 0 012-2.2z"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8L12 3.5z" fill="currentColor" stroke="none"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.3-4 4.4-6 8-6s6.7 2 8 6"/>',
  trash: '<path d="M4.5 7h15M10 11v6M14 11v6M6 7l1 12.5a1.5 1.5 0 001.5 1.5h7a1.5 1.5 0 001.5-1.5L18 7M9 7V4.5h6V7"/>',
  zoom: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6M11 8v6M8 11h6"/>',
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'app-icon' },
  template: `<svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" fill="none" stroke="currentColor"
    [attr.stroke-width]="stroke()" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="svg()"></svg>`,
  styles: `:host { display: inline-flex; line-height: 0; } svg { display: block; }`,
})
export class Icon {
  readonly name = input.required<string>();
  readonly size = input(22);
  readonly stroke = input(1.6);
  private readonly san = inject(DomSanitizer);
  // PATHS is a static, trusted constant — safe to bypass sanitisation.
  protected readonly svg = computed(() => this.san.bypassSecurityTrustHtml(PATHS[this.name()] ?? ''));
}
