import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function POST(request:Request){
  const body=await request.json().catch(()=>null);
  const orderId=String(body?.orderId||"").trim();
  const phone=String(body?.phone||"").replace(/\D/g,"");
  if(!/^SC-[A-F0-9]{10}$/i.test(orderId)||phone.length<9)return NextResponse.json({error:"Nomor pesanan atau WhatsApp tidak valid."},{status:400});
  const supabase=createAdminClient();
  if(!supabase)return NextResponse.json({error:"Database belum dikonfigurasi."},{status:503});
  const {data,error}=await supabase.from("orders").select("order_number,status,payment_status,total,phone").eq("order_number",orderId).maybeSingle();
  if(error||!data)return NextResponse.json({error:"Pesanan tidak ditemukan."},{status:404});
  if(String(data.phone).replace(/\D/g,"")!==phone)return NextResponse.json({error:"Pesanan tidak ditemukan."},{status:404});
  return NextResponse.json({orderId:data.order_number,status:data.status,paymentStatus:data.payment_status,total:data.total});
}
