import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "node:crypto";

export const runtime="nodejs";
export async function POST(request:Request){
  const body=await request.json().catch(()=>null);
  if(!body||!body.order_id||!body.status_code||!body.gross_amount||!body.signature_key)return NextResponse.json({error:"Invalid notification"},{status:400});
  const key=process.env.MIDTRANS_SERVER_KEY;
  if(!key)return NextResponse.json({error:"Gateway not configured"},{status:503});
  const expected=crypto.createHash("sha512").update(`${body.order_id}${body.status_code}${body.gross_amount}${key}`).digest("hex");
  const a=Buffer.from(expected);const b=Buffer.from(String(body.signature_key));
  if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return NextResponse.json({error:"Invalid signature"},{status:401});
  const status=String(body.transaction_status);
  const fraud=String(body.fraud_status||"");
  let paymentStatus="pending";let orderStatus="pending_payment";
  if(status==="capture"&&fraud==="accept"){paymentStatus="paid";orderStatus="paid";}
  else if(status==="settlement"){paymentStatus="paid";orderStatus="paid";}
  else if(["deny","cancel","expire","failure"].includes(status)){paymentStatus="failed";orderStatus="payment_failed";}
  const supabase=createAdminClient();
  if(!supabase)return NextResponse.json({error:"Database unavailable"},{status:503});
  const {error}=await supabase.from("orders").update({payment_status:paymentStatus,status:orderStatus,midtrans_transaction_id:body.transaction_id||null,midtrans_transaction_status:status,updated_at:new Date().toISOString()}).eq("order_number",body.order_id);
  if(error){console.error("Notification update failed",error.message);return NextResponse.json({error:"Update failed"},{status:500});}
  return NextResponse.json({received:true});
}
