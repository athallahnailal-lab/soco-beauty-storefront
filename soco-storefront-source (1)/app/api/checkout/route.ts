import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { products } from "@/lib/products";
import crypto from "node:crypto";

export const runtime = "nodejs";
type Item = { productId:string; quantity:number };
type Body = {
  customer:{name:string;phone:string;email?:string;address:string;city:string;province?:string;postalCode:string};
  items:Item[]; shippingMethod:"regular"|"express"; paymentMethod:"qris"|"bank_transfer"; consent:boolean;
};
const jsonError=(message:string,status=400)=>NextResponse.json({error:message},{status});

export async function POST(request:Request) {
  let body:Body;
  try { body=await request.json() as Body; } catch { return jsonError("Request tidak valid."); }
  if(!body?.consent)return jsonError("Persetujuan pemrosesan data diperlukan.");
  const c=body.customer;
  if(!c||c.name?.trim().length<2||c.phone?.replace(/\D/g,"").length<9||c.address?.trim().length<5||c.city?.trim().length<2||!c.postalCode?.trim())return jsonError("Data pembeli atau alamat belum lengkap.");
  if(c.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email))return jsonError("Email tidak valid.");
  if(!Array.isArray(body.items)||!body.items.length||body.items.length>30)return jsonError("Keranjang tidak valid.");
  if(!["regular","express"].includes(body.shippingMethod)||!["qris","bank_transfer"].includes(body.paymentMethod))return jsonError("Pilihan pengiriman atau pembayaran tidak valid.");
  const quantities=new Map<string,number>();
  for(const item of body.items){if(!item||!products.some(p=>p.id===item.productId)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>20)return jsonError("Produk atau kuantitas tidak valid.");quantities.set(item.productId,(quantities.get(item.productId)||0)+item.quantity);}
  if([...quantities.values()].some(q=>q>20))return jsonError("Jumlah produk melebihi batas.");
  const items=[...quantities.entries()].map(([id,quantity])=>{const p=products.find(x=>x.id===id)!;return {id:p.id,price:p.price,quantity,name:p.name};});
  const subtotal=items.reduce((s,x)=>s+x.price*x.quantity,0);
  const shipping=body.shippingMethod==="express"?20000:10000;
  const total=subtotal+shipping; // Example tariff only. Replace with verified carrier pricing and server-side promo validation.
  const supabase=createAdminClient();
  if(!supabase)return jsonError("Backend belum dikonfigurasi. Isi variabel Supabase dan service-role key di environment sebelum checkout.",503);
  const serverKey=process.env.MIDTRANS_SERVER_KEY;
  const clientKey=process.env.MIDTRANS_CLIENT_KEY;
  if(!serverKey||!clientKey)return jsonError("Payment gateway belum dikonfigurasi. Checkout nyata belum tersedia.",503);
  const orderId=`SC-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
  const {error:insertError}=await supabase.from("orders").insert({
    order_number:orderId,customer_name:c.name.trim(),phone:c.phone.trim(),email:c.email?.trim()||null,
    address:c.address.trim(),city:c.city.trim(),province:c.province?.trim()||null,postal_code:c.postalCode.trim(),
    shipping_method:body.shippingMethod,payment_method:body.paymentMethod,subtotal,shipping_fee:shipping,discount:0,total,
    status:"pending_payment",payment_status:"pending",items
  });
  if(insertError){console.error("Order insert failed",insertError.message);return jsonError("Pesanan belum dapat disimpan. Silakan coba lagi.",503);}
  const production=process.env.MIDTRANS_IS_PRODUCTION==="true";
  const base=production?"https://app.midtrans.com":"https://app.sandbox.midtrans.com";
  const auth=Buffer.from(`${serverKey}:`).toString("base64");
  const payload={
    transaction_details:{order_id:orderId,gross_amount:total},
    customer_details:{first_name:c.name.trim(),email:c.email?.trim()||undefined,phone:c.phone.trim(),billing_address:{first_name:c.name.trim(),phone:c.phone.trim(),address:c.address.trim(),city:c.city.trim(),postal_code:c.postalCode.trim(),country_code:"IDN"}},
    item_details:[...items.map(x=>({id:x.id,price:x.price,quantity:x.quantity,name:x.name.slice(0,50)})),{id:"shipping",price:shipping,quantity:1,name:`Shipping ${body.shippingMethod}`}],
    enabled_payments:body.paymentMethod==="qris"?["qris"]:["bank_transfer","bca_va","bni_va","bri_va","permata_va"],
    callbacks:{finish:`${process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"}/payment/return`}
  };
  try{
    const gateway=await fetch(`${base}/snap/v1/transactions`,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json","Authorization":`Basic ${auth}`},body:JSON.stringify(payload),cache:"no-store"});
    const result=await gateway.json();
    if(!gateway.ok||!result.redirect_url){console.error("Midtrans request failed",gateway.status);return jsonError("Pesanan tercatat, tetapi sesi pembayaran gagal dibuat. Silakan hubungi operator toko.",502);}
    await supabase.from("orders").update({payment_reference:result.token,payment_url:result.redirect_url}).eq("order_number",orderId);
    return NextResponse.json({orderId,redirect_url:result.redirect_url});
  }catch(err){console.error("Payment gateway unavailable",err);return jsonError("Payment gateway tidak dapat dihubungi. Silakan coba kembali.",502);}
}
