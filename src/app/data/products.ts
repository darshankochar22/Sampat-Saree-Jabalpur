export type Category = 'sarees' | 'suits' | 'kurtis' | 'lehengas';

export interface Product {
  id: string;
  name: string;
  category: Category;
  fabric: string;
  price: number;
  mrp: number;
  images: string[];
  colors: string[];
  tag?: 'New' | 'Bestseller' | 'Festive';
  description: string;
}

export const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const CATEGORIES: { slug: Category; name: string; blurb: string; image: string }[] = [
  { slug: 'sarees', name: 'Sarees', blurb: 'Banarasi, Kanjeevaram, georgette & more', image: 'photo-1610030469983-98e550d6193c' },
  { slug: 'suits', name: 'Suits', blurb: 'Unstitched & ready-to-wear sets', image: 'photo-1745313452052-0e4e341f326c' },
  { slug: 'kurtis', name: 'Kurtis', blurb: 'Everyday elegance in cotton & rayon', image: 'photo-1741847639057-b51a25d42892' },
  { slug: 'lehengas', name: 'Lehengas', blurb: 'Bridal and festive couture', image: 'photo-1759906760638-eeffcb471e53' },
];

export const PRODUCTS: Product[] = [
  { id: 'banarasi-crimson', name: 'Crimson Banarasi Silk Saree', category: 'sarees', fabric: 'Pure Banarasi Silk', price: 12499, mrp: 15999, tag: 'Bestseller',
    images: ['photo-1610030469983-98e550d6193c', 'photo-1617633150878-7df1d12a9a57'], colors: ['#8b1e2d', '#c9a24d'],
    description: 'A timeless Banarasi silk woven with intricate zari buttis and a rich pallu. Comes with an unstitched blouse piece.' },
  { id: 'emerald-kanjeevaram', name: 'Emerald Kanjeevaram Saree', category: 'sarees', fabric: 'Kanjeevaram Silk', price: 18999, mrp: 22999, tag: 'Festive',
    images: ['photo-1679006831648-7c9ea12e5807', 'photo-1688382654723-a7366006519b'], colors: ['#1f5c3a', '#c9a24d'],
    description: 'Temple-border Kanjeevaram in deep emerald with a contrast gold pallu — made for weddings and pujas.' },
  { id: 'lavender-zari', name: 'Lavender Zari Organza Saree', category: 'sarees', fabric: 'Organza', price: 6499, mrp: 7999, tag: 'New',
    images: ['photo-1641699862936-be9f49b1c38d', 'photo-1710967075806-327bc44da2cb'], colors: ['#7d5a9b', '#d8c39a'],
    description: 'Feather-light organza with a delicate zari border. An easy drape for day functions and cocktail evenings.' },
  { id: 'sunset-chiffon', name: 'Sunset Chiffon Saree', category: 'sarees', fabric: 'Chiffon', price: 3299, mrp: 4299,
    images: ['photo-1617627143750-d86bc21e42bb', 'photo-1769275061202-cf3ef67d7279'], colors: ['#e07a5f', '#d6336c'],
    description: 'Flowing pink-and-orange chiffon with a gota lace edge. Soft, breezy and easy to carry all day.' },
  { id: 'indigo-pattu', name: 'Indigo & Mustard Pattu Saree', category: 'sarees', fabric: 'Soft Silk', price: 5799, mrp: 6999,
    images: ['photo-1610189012906-4c0aa9b9781e', 'photo-1693023656257-87c142566ad3'], colors: ['#2b4c7e', '#e0a526'],
    description: 'Soft silk pattu in indigo with a mustard border — a modern colour story on a classic weave.' },
  { id: 'monochrome-georgette', name: 'Monochrome Printed Georgette', category: 'sarees', fabric: 'Georgette', price: 2499, mrp: 3199,
    images: ['photo-1572470176170-98fa8abcb741'], colors: ['#111111', '#f5f5f5'],
    description: 'Black-and-white abstract print on fluid georgette. Office-ready, party-ready.' },
  { id: 'rose-bridal', name: 'Rose Gold Bridal Saree', category: 'sarees', fabric: 'Tissue Silk', price: 21999, mrp: 26999, tag: 'Festive',
    images: ['photo-1610047520958-b42ebcd2f6cb', 'photo-1610047614256-023d7c028d0b'], colors: ['#b5374a', '#e8c9a0'],
    description: 'Tissue silk with heavy floral embroidery and a scalloped border, designed for the bride and her closest.' },

  { id: 'ivory-chikankari', name: 'Ivory Chikankari Suit Set', category: 'suits', fabric: 'Cotton Mul', price: 4499, mrp: 5499, tag: 'Bestseller',
    images: ['photo-1745313452052-0e4e341f326c'], colors: ['#f4efe6'],
    description: 'Hand-embroidered Lucknowi chikankari kurta with straight pants and a mul dupatta.' },
  { id: 'blush-anarkali', name: 'Blush Floral Anarkali Suit', category: 'suits', fabric: 'Rayon', price: 3299, mrp: 3999, tag: 'New',
    images: ['photo-1762777777819-4d9aa5529368'], colors: ['#f2b8c6'],
    description: 'Flared anarkali in blush florals with a tie-neck bow, paired with matching pants and dupatta.' },
  { id: 'maroon-velvet', name: 'Maroon Velvet Suit', category: 'suits', fabric: 'Velvet', price: 5999, mrp: 7499, tag: 'Festive',
    images: ['photo-1708534246055-d7b149acb731'], colors: ['#6d1a2a'],
    description: 'Rich velvet with zardozi detailing on the yoke. Winter wedding season, sorted.' },
  { id: 'plum-silk-suit', name: 'Plum Silk Suit Material', category: 'suits', fabric: 'Art Silk (Unstitched)', price: 2799, mrp: 3499,
    images: ['photo-1708534246051-7f47b279e94b'], colors: ['#6b3a75'],
    description: 'Unstitched suit material — 2.5 m top, 2.5 m bottom and a printed dupatta. Stitch it your way.' },

  { id: 'rose-print-kurti', name: 'Rose Print Straight Kurti', category: 'kurtis', fabric: 'Cotton', price: 1299, mrp: 1699, tag: 'Bestseller',
    images: ['photo-1741847639057-b51a25d42892'], colors: ['#f4a6b8'],
    description: 'Breathable cotton kurti with a pink rose print and three-quarter sleeves.' },
  { id: 'garden-kurti', name: 'Garden Floral Kurti Set', category: 'kurtis', fabric: 'Rayon', price: 1799, mrp: 2299, tag: 'New',
    images: ['photo-1765529374927-052599af9c82', 'photo-1767785829347-cc13bd969514'], colors: ['#d97b66', '#3a6b4c'],
    description: 'A relaxed kurti and pant set in a garden floral print — your new everyday favourite.' },
  { id: 'sunshine-tiered', name: 'Sunshine Tiered Kurti', category: 'kurtis', fabric: 'Cotton Slub', price: 1499, mrp: 1899,
    images: ['photo-1760287363878-1a09af715b80'], colors: ['#f2c14e'],
    description: 'Tiered A-line kurti in sunshine yellow with an embroidered neckline.' },
  { id: 'paisley-kurti', name: 'Midnight Paisley Kurti', category: 'kurtis', fabric: 'Rayon', price: 1399, mrp: 1799,
    images: ['photo-1760287364219-160c234ded00'], colors: ['#1f2a4d'],
    description: 'Deep navy kurti with an all-over paisley print. Pairs with leggings, palazzos or jeans.' },

  { id: 'scarlet-bridal-lehenga', name: 'Scarlet Bridal Lehenga', category: 'lehengas', fabric: 'Raw Silk', price: 45999, mrp: 54999, tag: 'Festive',
    images: ['photo-1759906760638-eeffcb471e53', 'photo-1724856604254-f7cf4e9c8f72'], colors: ['#a3142a', '#c9a24d'],
    description: 'Heavily embroidered bridal lehenga with dabka and sequin work, a matching blouse and a net dupatta.' },
  { id: 'marigold-lehenga', name: 'Marigold & Maroon Lehenga', category: 'lehengas', fabric: 'Silk Blend', price: 24999, mrp: 29999, tag: 'New',
    images: ['photo-1767955694884-d4bf352c23c2'], colors: ['#e5a823', '#6d1a2a'],
    description: 'Mehendi and haldi ready: marigold yellow with maroon borders and mirror work.' },
  { id: 'ruby-lehenga', name: 'Ruby Zari Lehenga Choli', category: 'lehengas', fabric: 'Banarasi Brocade', price: 32999, mrp: 38999,
    images: ['photo-1654764746225-e63f5e90facd', 'photo-1732508531942-f36d9da79d9e'], colors: ['#9b1b30', '#c9a24d'],
    description: 'Banarasi brocade lehenga in ruby red with a zari-woven choli and an organza dupatta.' },
];

export const findProduct = (id: string) => PRODUCTS.find(p => p.id === id);
