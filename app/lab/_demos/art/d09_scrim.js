// 만들어진 파일 — 원본: 모션 연출 실습 사전 아티팩트 d09. 직접 고치지 않는다 — 응용 팁 'scrim' 적용본
/* eslint-disable */
// @ts-nocheck
import { seg, lerp, E, el, rng, canvas } from "./helpers.js";
const demo = {
  dur: 7, rest: 4.4, noCompare: false,
  mount(sp){
    const ctx=canvas(sp);
    const off=document.createElement('canvas');off.width=128;off.height=72;const o=off.getContext('2d');
    const gr=document.createElement('canvas');gr.width=256;gr.height=256;const gx=gr.getContext('2d');const id=gx.createImageData(256,256);const r=rng(5);
    for(let i=0;i<id.data.length;i+=4){const v=r()*255;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=18;}gx.putImageData(id,0,0);
    const tag=el('div','mg-tag',sp);const tx=el('div','mg-t',sp,'당신의 하루를<br>바꾸는 한 가지');
    return {ctx,off,o,gr,tag};
  },
  render(s,t,a){
    const A=['#0b132b','#1b3b6f','#2a9d8f','#5e60ce','#3a86ff'],B=['#2b0a3d','#ff6b35','#f72585','#ffd166','#ff006e'];
    const mAt=x=>x<2.2?0:x<3.4?E.inOutC(seg(x,2.2,3.4)):x<5.8?1:1-E.inOutC(seg(x,5.8,7));
    const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
    const mix=(h1,h2,m)=>{const x=hex(h1),y=hex(h2);return 'rgb('+x.map((v,i)=>Math.round(lerp(v,y[i],m))).join(',')+')';};
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);
    if(!a){
      const m=t>=2.8&&t<6.4?1:0;
      const g=c.createLinearGradient(0,0,640,360);g.addColorStop(0,m?B[1]:A[1]);g.addColorStop(1,m?B[2]:A[2]);c.fillStyle=g;c.fillRect(0,0,640,360);
      s.tag.textContent=m?'에너지 · 설렘':'차분함 · 신뢰';return;
    }
    const m=mAt(t);
    let ph=0;const N=24;for(let i=0;i<N;i++){const x=t*(i+.5)/N;ph+=(.35+.75*mAt(x))*(t/N);}
    const o=s.o;o.fillStyle=mix(A[0],B[0],m);o.fillRect(0,0,128,72);
    const orb=[[.7,1.3,0],[1.1,.8,2],[.9,1.7,4],[1.4,1.0,1]];
    o.globalCompositeOperation='lighter';
    orb.forEach((q,i)=>{
      const k=ph*1.6+q[2];const x=64+44*Math.sin(k*q[0]),y=36+26*Math.cos(k*q[1]);
      const g=o.createRadialGradient(x,y,0,x,y,58);const col=mix(A[i+1],B[i+1],m);
      g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');o.globalAlpha=.75;o.fillStyle=g;o.fillRect(0,0,128,72);
    });
    o.globalCompositeOperation='source-over';o.globalAlpha=1;
    c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(s.off,0,0,640,360);
    c.fillStyle='rgba(0,0,0,.4)';c.fillRect(0,0,640,360);
    const pat=c.createPattern(s.gr,'repeat');c.save();c.translate((t*97%64)|0,(t*61%64)|0);c.fillStyle=pat;c.fillRect(-64,-64,768,488);c.restore();
    s.tag.textContent=m<.5?'차분함 · 신뢰':'에너지 · 설렘';
  }
};
export default demo;
