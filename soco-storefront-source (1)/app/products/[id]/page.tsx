import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import { Header, Footer, ProductDetail } from "@/components/storefront";

export function generateStaticParams() { return products.map(p=>({id:p.id})); }
export default async function ProductPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const product=products.find(p=>p.id===id);
  if(!product)notFound();
  return <><Header/><ProductDetail product={product}/><Footer/></>;
}
