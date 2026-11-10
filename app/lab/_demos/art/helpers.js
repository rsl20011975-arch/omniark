// 만들어진 파일 — 원본: 모션 연출 실습 사전 아티팩트의 helpers. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const seg=(t,a,b)=>cl((t-a)/(b-a));
const lerp=(a,b,p)=>a+(b-a)*p;
const E={
  lin:x=>x,
  outC:x=>1-Math.pow(1-x,3),
  inC:x=>x*x*x,
  inOutC:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,
  outExpo:x=>x>=1?1:1-Math.pow(2,-10*x),
  outBack:x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);}
};
function el(tag,cls,parent,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(parent)parent.appendChild(e);return e;}
function box(parent,cls,x,y,w,h,html){const e=el('div','abs '+(cls||''),parent,html);Object.assign(e.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});return e;}
function rng(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function canvas(sp){const c=el('canvas',null,sp);c.width=1280;c.height=720;const ctx=c.getContext('2d');return ctx;}
function rr(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
const fmt=n=>Math.round(n).toLocaleString('ko-KR');
const reduce=typeof window!=='undefined'&&window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;


export { cl, seg, lerp, E, el, box, rng, canvas, rr, fmt, reduce };
