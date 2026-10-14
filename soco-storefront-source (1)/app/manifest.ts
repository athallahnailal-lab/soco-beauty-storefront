import type { MetadataRoute } from "next";
export default function manifest():MetadataRoute.Manifest{return {name:"SOCO Beauty",short_name:"SOCO",description:"Beauty, curated for you",start_url:"/",display:"standalone",background_color:"#fffafd",theme_color:"#c92770",icons:[{src:"/icon.svg",sizes:"any",type:"image/svg+xml",purpose:"any"}]};}
