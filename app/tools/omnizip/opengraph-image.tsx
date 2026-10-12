import { ImageResponse } from "next/og";
export const alt = "OmniZip — A little more organized. Windows archive workspace by OMNIARK.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",background:"#f6f5f2",padding:70,color:"#282431"}}><div style={{display:"flex",fontSize:24,letterSpacing:6}}>OMNIARK / WINDOWS TOOLS</div><div style={{display:"flex",flexDirection:"column"}}><div style={{fontSize:100,fontWeight:700,color:"#6948c7",display:"flex"}}>OmniZip</div><div style={{fontSize:42,display:"flex",marginTop:20}}>A little more organized.</div></div><div style={{display:"flex",fontSize:23}}>Preview. Extract. Organize.   /   Windows x64 preview</div></div>,size); }
