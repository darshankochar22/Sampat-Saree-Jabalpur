import { Pipe, PipeTransform } from '@angular/core';

const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

@Pipe({ name: 'inr' })
export class InrPipe implements PipeTransform {
  transform(v: number) { return fmt.format(v); }
}
