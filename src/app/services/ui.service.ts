import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiService {
  readonly searchOpen = signal(false);
  readonly menuOpen = signal(false);
}
