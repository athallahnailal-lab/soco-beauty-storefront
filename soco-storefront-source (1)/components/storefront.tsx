"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Heart, Menu, Search, ShieldCheck, ShoppingBag, Sparkles, Truck, UserRound, X } from "lucide-react";
import { products, formatIDR, type Product } from "@/lib/products";

type CartLine = { productId:string; quantity:number };
const CART_KEY = "soco-cart-v1";

export function Header() {
  const [count,setCount] = useState(0);
  const [menu,setMenu] = useState(false);
  useEffect(()=>{ const sync=()=>{try{const c=JSON.parse(localStorage.getItem(CART_KEY)||"[]") as CartLine[];setCount(c.reduce((s,x)=>s+x.quantity,0));}catch{setCount(0)}};sync();window.addEventListener("soco-cart-updated",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("soco-cart-updated",sync);window.removeEventListener("storage",sync)}; },[]);
  return <>
    <div className="topbar">A LITTLE BEAUTY, A LOT OF CONFIDENCE · CHECKOUT TANPA WAJIB DAFTAR</div>
    <header className="header"><div className="container header-inner">
      <Link href="/" className="logo" aria-label="SOCO Beauty beranda">SOCO<small>by Sociolla</small></Link>
      <nav className="nav"><Link href="/#shop">Skincare</Link><Link href="/#shop">Makeup</Link><Link href="/#benefits">Beauty Benefits</Link></nav>
      <div className="header-actions">
        <Link className="icon-button" href="/#shop" aria-label="Cari produk"><Search size={19}/></Link>
        <Link className="icon-button" href="/cart" aria-label="Keranjang"><ShoppingBag size={20}/><span className="cart-count">{count}</span></Link>
        <Link href="/orders" className="icon-button" aria-label="Pesanan"><UserRound size={19}/></Link>
        <button className="icon-button mobile-menu" aria-label="Buka menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
      </div>
    </div>{menu&&<div className="container" style={{paddingBottom:18,display:"grid",gap:14}}><Link href="/#shop" onClick={()=>setMenu(false)}>Belanja produk</Link><Link href="/cart" onClick={()=>setMenu(false)}>Keranjang</Link><Link href="/orders" onClick={()=>setMenu(false)}>Pesanan saya</Link></div>}</header>
  </>;
}

export function Footer() {
  return <footer className="footer"><div className="container"><div className="footer-grid">
    <div><div className="logo" style={{color:"#fff"}}>SOCO<small style={{color:"#e0cbd5"}}>by Sociolla</small></div><p>Beauty, curated for you. Temukan produk untuk menemani rutinitas kecantikanmu.</p></div>
    <div><h3>Jelajahi</h3><p><Link href="/#shop">Semua produk</Link><br/><Link href="/cart">Keranjang</Link><br/><Link href="/orders">Pesanan</Link></p></div>
    <div><h3>Bantuan</h3><p>Informasi pesanan<br/>Pengiriman & pembayaran<br/>Kebijakan privasi</p></div>
    </div><div className="footer-bottom">© {new Date().getFullYear()} SOCO Beauty storefront starter. Bukan situs resmi Sociolla.</div></div></footer>;
}

export function Storefront() {
  const [category,setCategory] = useState("Semua");
  const [query,setQuery] = useState("");
  const [added,setAdded] = useState("");
  const filtered = useMemo(()=>products.filter(p=>(category==="Semua"||p.category===category)&&`${p.brand} ${p.name}`.toLowerCase().includes(query.toLowerCase())),[category,query]);
  function add(product:Product) {
    try { const cart=JSON.parse(localStorage.getItem(CART_KEY)||"[]") as CartLine[]; const found=cart.find(x=>x.productId===product.id);if(found)found.quantity=Math.min(20,found.quantity+1);else cart.push({productId:product.id,quantity:1});localStorage.setItem(CART_KEY,JSON.stringify(cart));window.dispatchEvent(new Event("soco-cart-updated"));setAdded(product.id);window.setTimeout(()=>setAdded(""),1800); } catch { setAdded("error"); }
  }
  return <>
    <section className="hero"><div className="container hero-grid">
      <div><div className="eyebrow"><Sparkles size={14} style={{display:"inline",verticalAlign:"middle",marginRight:7}}/>Your daily beauty edit</div><h1>Beauty that feels<br/><span style={{color:"var(--pink)"}}>like you.</span></h1><p>Temukan skincare dan makeup pilihan untuk ritual kecil yang bikin kamu merasa lebih percaya diri. Belanja praktis, dengan opsi checkout sebagai tamu.</p><div className="hero-actions"><Link className="button button-primary" href="#shop">Jelajahi Produk <ArrowRight size={16}/></Link><Link className="button button-outline" href="/cart">Lihat Keranjang</Link></div><p className="hero-note">♡ Pilihan beauty essentials · Checkout tanpa wajib buat akun</p></div>
      <div className="hero-art"><div className="art-halo"/><div className="art-card"><Image src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=85" alt="Produk skincare di atas latar lembut" fill sizes="(max-width: 650px) 90vw, 430px" priority style={{objectFit:"cover"}}/></div><div className="floating-tag"><strong>Beauty, your way ✨</strong><span>Ritual sederhana, rasa istimewa.</span></div></div>
    </div></section>
    <section className="section" id="shop"><div className="container">
      <div className="section-head"><div><div className="eyebrow">The beauty shelf</div><h2>Temukan favorit barumu</h2><p>Kurasi produk untuk rutinitas sehari-hari.</p></div><span style={{fontSize:12,color:"var(--muted)"}}>{filtered.length} produk</span></div>
      <div className="pill-row">{["Semua","Skincare","Makeup"].map(c=><button key={c} className={`pill ${category===c?"active":""}`} onClick={()=>setCategory(c)}>{c}</button>)}</div>
      <div className="field" style={{maxWidth:390}}><input aria-label="Cari produk" placeholder="Cari nama produk atau brand..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
      <div className="product-grid">{filtered.map(p=><article className="product-card" key={p.id}><Link href={`/products/${p.id}`} className="product-image">{p.badge&&<span className="product-badge">{p.badge}</span>}<Image src={p.image} alt={p.name} fill sizes="(max-width:650px) 45vw, (max-width:900px) 45vw, 25vw" style={{objectFit:"cover"}}/></Link><div className="product-info"><div className="brand">{p.brand}</div><Link href={`/products/${p.id}`} className="product-name">{p.name}</Link><div className="rating">★ {p.rating} <span style={{color:"#9c8993"}}>({p.reviews} ulasan)</span></div><div className="product-bottom"><span className="price">{formatIDR(p.price)}</span><button className="add-mini" onClick={()=>add(p)} aria-label={`Tambah ${p.name} ke keranjang`}>{added===p.id?<Check size={17}/>:<ShoppingBag size={16}/>}</button></div>{added===p.id&&<div style={{fontSize:11,color:"var(--green)",marginTop:8}}>Ditambahkan ke keranjang</div>}</div></article>)}</div>
    </div></section>
    <section className="benefit-strip" id="benefits"><div className="container benefits">
      <div className="benefit"><div className="benefit-icon"><ShieldCheck/></div><div><strong>Checkout praktis</strong><span>Belanja sebagai tamu, tanpa akun wajib.</span></div></div>
      <div className="benefit"><div className="benefit-icon"><Truck/></div><div><strong>Info pengiriman jelas</strong><span>Pilih layanan sesuai kebutuhanmu.</span></div></div>
      <div className="benefit"><div className="benefit-icon"><Heart/></div><div><strong>Beauty, made personal</strong><span>Kurasi untuk rutinitasmu.</span></div></div>
    </div></section>
  </>;
}

export function ProductDetail({product}: {product:Product}) {
  const [qty,setQty] = useState(1);
  const [message,setMessage] = useState("");
  function add(goCheckout=false) {
    const cart=JSON.parse(localStorage.getItem(CART_KEY)||"[]") as CartLine[];
    const found=cart.find(x=>x.productId===product.id);
    if(found)found.quantity=Math.min(20,found.quantity+qty);else cart.push({productId:product.id,quantity:qty});
    localStorage.setItem(CART_KEY,JSON.stringify(cart));window.dispatchEvent(new Event("soco-cart-updated"));
    if(goCheckout)window.location.href="/checkout";else setMessage("Produk berhasil ditambahkan ke keranjang.");
  }
  return <main className="page"><div className="container"><div className="breadcrumb"><Link href="/">Beranda</Link> / {product.category} / {product.brand}</div><div className="product-detail"><div className="detail-image"><Image src={product.image} alt={product.name} width={900} height={900} priority style={{width:"100%",height:"100%",objectFit:"cover"}}/></div><div className="detail-copy"><div className="brand">{product.brand}</div><h1>{product.name}</h1><div className="rating">★ {product.rating}/5 · {product.reviews} ulasan</div><div className="detail-price">{formatIDR(product.price)}</div><div className="stock">● Contoh status stok tersedia</div><p className="muted" style={{marginTop:22}}>{product.description}</p><div className="qty-control"><button onClick={()=>setQty(Math.max(1,qty-1))} aria-label="Kurangi jumlah">−</button><span>{qty}</span><button onClick={()=>setQty(Math.min(20,qty+1))} aria-label="Tambah jumlah">+</button></div><div className="detail-actions"><button className="button button-outline" onClick={()=>add(false)}>Tambah ke Keranjang</button><button className="button button-primary" onClick={()=>add(true)}>Beli Sekarang</button></div>{message&&<p className="stock" style={{marginTop:12}}>{message}</p>}<div className="notice">Harga, rating, ulasan, stok, dan foto di starter ini merupakan data contoh. Ganti dengan data katalog resmi sebelum diluncurkan.</div></div></div></div></main>;
}

export function CartPage() {
  const [cart,setCart] = useState<CartLine[]>([]);
  useEffect(()=>{try{setCart(JSON.parse(localStorage.getItem(CART_KEY)||"[]"));}catch{}},[]);
  const lines=cart.map(line=>({line,product:products.find(p=>p.id===line.productId)})).filter(x=>x.product) as {line:CartLine;product:Product}[];
  const subtotal=lines.reduce((s,x)=>s+x.product.price*x.line.quantity,0);
  function save(next:CartLine[]){setCart(next);localStorage.setItem(CART_KEY,JSON.stringify(next));window.dispatchEvent(new Event("soco-cart-updated"));}
  return <main className="page"><div className="container"><div className="breadcrumb"><Link href="/">Beranda</Link> / Keranjang</div><h2>Keranjang belanja</h2><p className="muted">Periksa pilihanmu sebelum melanjutkan ke checkout.</p>{!lines.length?<div className="empty-state"><ShoppingBag size={38} color="var(--pink)" style={{marginBottom:15}}/><h3>Keranjangmu masih kosong</h3><p className="muted">Temukan produk yang cocok untuk rutinitasmu.</p><Link href="/#shop" className="button button-primary">Jelajahi Produk</Link></div>:<div className="checkout-layout"><div>{lines.map(({line,product})=><div className="panel" key={line.productId} style={{display:"flex",gap:18,alignItems:"center"}}><div style={{width:105,height:110,position:"relative",background:"#f9edf2",borderRadius:12,overflow:"hidden",flexShrink:0}}><Image src={product.image} alt={product.name} fill sizes="105px" style={{objectFit:"cover"}}/></div><div style={{flex:1}}><div className="brand">{product.brand}</div><h3>{product.name}</h3><strong>{formatIDR(product.price)}</strong><div className="qty-control" style={{marginBottom:0}}><button onClick={()=>save(cart.map(x=>x.productId===line.productId?{...x,quantity:Math.max(1,x.quantity-1)}:x))}>−</button><span>{line.quantity}</span><button onClick={()=>save(cart.map(x=>x.productId===line.productId?{...x,quantity:Math.min(20,x.quantity+1)}:x))}>+</button></div></div><button className="icon-button" onClick={()=>save(cart.filter(x=>x.productId!==line.productId))} aria-label="Hapus produk"><X/></button></div>)}</div><aside className="panel"><h3>Ringkasan belanja</h3><div className="summary-line"><span>Subtotal</span><strong>{formatIDR(subtotal)}</strong></div><div className="summary-line"><span>Ongkir</span><span>Dihitung berikutnya</span></div><div className="summary-line summary-total"><span>Subtotal produk</span><span>{formatIDR(subtotal)}</span></div><p className="muted">Ongkir dan promo akan dihitung pada langkah checkout.</p><Link href="/checkout" className="button button-primary" style={{width:"100%"}}>Lanjut Checkout <ArrowRight size={16}/></Link></aside></div>}</div></main>;
}

export function CheckoutPage() {
  const [cart,setCart] = useState<CartLine[]>([]);
  const [step,setStep] = useState(1);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [form,setForm] = useState({name:"",phone:"",email:"",address:"",city:"",province:"Jawa Timur",postalCode:"",courier:"regular",payment:"qris"});
  const [consent,setConsent] = useState(true);
  useEffect(()=>{try{setCart(JSON.parse(localStorage.getItem(CART_KEY)||"[]"));}catch{}},[]);
  const lines=cart.map(line=>({line,product:products.find(p=>p.id===line.productId)})).filter(x=>x.product) as {line:CartLine;product:Product}[];
  const subtotal=lines.reduce((s,x)=>s+x.product.price*x.line.quantity,0);
  const shipping=form.courier==="express"?20000:10000;
  const total=subtotal+shipping;
  const update=(key:string,value:string)=>setForm(old=>({...old,[key]:value}));
  async function submit(e:React.FormEvent) {
    e.preventDefault();setError("");
    if(!lines.length){setError("Keranjang kosong. Tambahkan produk sebelum checkout.");return;}
    if(step===1){if(form.name.trim().length<2||form.phone.replace(/\D/g,"").length<9){setError("Isi nama lengkap dan nomor WhatsApp yang valid.");return;}if(form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){setError("Format email belum valid.");return;}setStep(2);return;}
    if(!form.address.trim()||!form.city.trim()||!form.postalCode.trim()){setError("Lengkapi alamat, kota, dan kode pos.");return;}
    if(!consent){setError("Setujui pemrosesan data yang diperlukan untuk memproses pesanan.");return;}
    setBusy(true);
    try{
      const response=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer:form,items:lines.map(x=>({productId:x.product.id,quantity:x.line.quantity})),shippingMethod:form.courier,paymentMethod:form.payment,consent})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"Checkout belum dapat diproses.");
      if(data.redirect_url){window.location.href=data.redirect_url;return;}
      if(data.checkout_url){window.location.href=data.checkout_url;return;}
      throw new Error("Gateway tidak mengembalikan URL pembayaran.");
    }catch(err){setError(err instanceof Error?err.message:"Terjadi kesalahan.");}
    finally{setBusy(false);}
  }
  return <main className="page"><div className="container"><div className="breadcrumb"><Link href="/">Beranda</Link> / Checkout tamu</div><h2>Checkout</h2><p className="muted">Selesaikan pesanan tanpa harus membuat akun.</p>{!lines.length?<div className="empty-state"><h3>Keranjangmu masih kosong</h3><Link href="/#shop" className="button button-primary">Jelajahi Produk</Link></div>:<div className="checkout-layout"><form onSubmit={submit}><div className="panel"><div className="eyebrow">LANGKAH {step} DARI 2</div><div className="steps"><span className={`step ${step>=1?"active":""}`}/><span className={`step ${step>=2?"active":""}`}/></div>{step===1?<><h2>Data pembeli</h2><p className="muted">Kami menggunakan data ini untuk memproses pesanan dan pengiriman.</p><div className="field"><label htmlFor="name">Nama lengkap *</label><input id="name" autoComplete="name" required value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Nama penerima"/></div><div className="field"><label htmlFor="phone">Nomor WhatsApp *</label><input id="phone" autoComplete="tel" inputMode="tel" required value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="08xxxxxxxxxx"/><small>Untuk komunikasi pesanan. Checkout tidak memerlukan OTP; proses pembuatan akun dapat memerlukan verifikasi terpisah.</small></div><div className="field"><label htmlFor="email">Email (opsional)</label><input id="email" autoComplete="email" type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="nama@email.com"/></div><button type="submit" className="button button-primary">Lanjut ke alamat <ArrowRight size={16}/></button></>:<><h2>Alamat & pengiriman</h2><div className="field"><label htmlFor="address">Alamat lengkap *</label><textarea id="address" autoComplete="street-address" required rows={3} value={form.address} onChange={e=>update("address",e.target.value)} placeholder="Jalan, nomor rumah, kecamatan"/></div><div className="form-grid"><div className="field"><label htmlFor="city">Kota / Kabupaten *</label><input id="city" autoComplete="address-level2" required value={form.city} onChange={e=>update("city",e.target.value)} placeholder="Kota"/></div><div className="field"><label htmlFor="province">Provinsi</label><input id="province" autoComplete="address-level1" value={form.province} onChange={e=>update("province",e.target.value)}/></div></div><div className="field"><label htmlFor="postal">Kode pos *</label><input id="postal" autoComplete="postal-code" required value={form.postalCode} onChange={e=>update("postalCode",e.target.value)} placeholder="Kode pos"/></div><div className="field"><label htmlFor="courier">Layanan pengiriman</label><select id="courier" value={form.courier} onChange={e=>update("courier",e.target.value)}><option value="regular">Regular — estimasi ongkir Rp10.000 (contoh)</option><option value="express">Express — estimasi ongkir Rp20.000 (contoh)</option></select><small>Tarif ini hanya fallback contoh. Produksi wajib memakai tarif kurir dari integrasi yang valid.</small></div><h3>Metode pembayaran</h3>{[{id:"qris",title:"QRIS",desc:"Pembayaran melalui QRIS"},{id:"bank_transfer",title:"Virtual Account / Transfer",desc:"Metode yang tersedia dari gateway"},{id:"cod",title:"COD",desc:"Belum aktif tanpa integrasi kurir/COD"}].map(p=><label className={`payment-option ${form.payment===p.id?"selected":""}`} key={p.id} style={{opacity:p.id==="cod"?.55:1}}><input type="radio" name="payment" disabled={p.id==="cod"} checked={form.payment===p.id} onChange={()=>update("payment",p.id)}/><span><strong>{p.title}</strong><small>{p.desc}</small></span></label>)}<label style={{display:"flex",gap:10,alignItems:"start",fontSize:12,lineHeight:1.6,margin:"16px 0"}}><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} style={{accentColor:"var(--pink)",marginTop:3}}/>Saya menyetujui pemrosesan data yang diperlukan untuk transaksi dan pengiriman. Informasi privasi harus disediakan oleh operator toko sebelum produksi.</label><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button type="button" className="button button-outline" onClick={()=>setStep(1)}>Kembali</button><button type="submit" disabled={busy} className="button button-primary">{busy?"Menyiapkan pembayaran…":"Lanjut ke pembayaran"}</button></div></>}{error&&<div className="error" role="alert">{error}</div>}</div></form><aside className="panel summary-panel"><h3>Ringkasan pesanan</h3>{lines.map(({line,product})=><div key={product.id} className="summary-line"><span>{product.name} × {line.quantity}</span><strong>{formatIDR(product.price*line.quantity)}</strong></div>)}<div className="summary-line"><span>Subtotal</span><span>{formatIDR(subtotal)}</span></div><div className="summary-line"><span>Ongkir (estimasi)</span><span>{formatIDR(shipping)}</span></div><div className="summary-line summary-total"><span>Total</span><span>{formatIDR(total)}</span></div><p className="muted">Total final dihitung kembali di server sebelum sesi pembayaran dibuat.</p></aside></div>}</div></main>;
}

export function OrdersPage() {
  const [orderId,setOrderId] = useState("");
  const [phone,setPhone] = useState("");
  const [message,setMessage] = useState("");
  const [busy,setBusy] = useState(false);
  async function lookup(e:React.FormEvent){e.preventDefault();setMessage("");setBusy(true);try{const r=await fetch("/api/orders/lookup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId,phone})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Pesanan tidak ditemukan.");setMessage(`Status pesanan: ${d.status}. Total: ${formatIDR(d.total)}.`);}catch(e){setMessage(e instanceof Error?e.message:"Pencarian gagal.");}finally{setBusy(false);}}
  return <main className="page"><div className="container" style={{maxWidth:700}}><div className="breadcrumb"><Link href="/">Beranda</Link> / Pesanan</div><h2>Lacak pesananmu</h2><p className="muted">Masukkan nomor pesanan dan nomor WhatsApp untuk melihat status. Endpoint ini harus dikonfigurasi bersama database.</p><form className="panel" onSubmit={lookup}><div className="field"><label htmlFor="order">Nomor pesanan</label><input id="order" required value={orderId} onChange={e=>setOrderId(e.target.value)} placeholder="SC-..."/></div><div className="field"><label htmlFor="lookup-phone">Nomor WhatsApp</label><input id="lookup-phone" required inputMode="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Nomor saat checkout"/></div><button className="button button-primary" disabled={busy}>{busy?"Mencari…":"Lihat status pesanan"}</button>{message&&<p role="status" className="muted" style={{marginTop:15}}>{message}</p>}</form></div></main>;
}
