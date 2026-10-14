export type Product = {
  id: string; brand: string; name: string; price: number; rating: string;
  reviews: string; category: string; image: string; badge?: string; description: string;
};
export const products: Product[] = [
  { id:"cosrx-aloe", brand:"COSRX", name:"Aloe Soothing Sun Cream SPF50+", price:159000, rating:"4.8", reviews:"1.200", category:"Skincare", image:"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1000&q=85", badge:"Bestseller", description:"Sunscreen harian dengan tekstur nyaman. Periksa label dan petunjuk resmi produk sebelum digunakan." },
  { id:"laneige-mask", brand:"LANEIGE", name:"Lip Sleeping Mask", price:285000, rating:"4.9", reviews:"842", category:"Skincare", image:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=85", badge:"Favorit", description:"Perawatan bibir untuk rutinitas malam. Ketersediaan dan harga merupakan contoh katalog." },
  { id:"romand-tint", brand:"rom&nd", name:"Juicy Lasting Tint", price:119000, rating:"4.7", reviews:"956", category:"Makeup", image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85", description:"Lip tint untuk melengkapi tampilan harian." },
  { id:"skin1004-serum", brand:"SKIN1004", name:"Centella Ampoule", price:179000, rating:"4.8", reviews:"731", category:"Skincare", image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=85", description:"Ampoule untuk rutinitas perawatan kulit." }
];
export const formatIDR = (amount:number) => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(amount);
