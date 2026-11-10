// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d14. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas, rr } from "./helpers.js";
import { TAU, bgFill, bolt, cap, glowDot } from "./shared/common.js";

const STRIKES=[{t:1.1,x0:150,x1:170,seed:4},{t:2.5,x0:430,x1:410,seed:9},{t:3.8,x0:300,x1:330,seed:15}];

const demo = {
  dur: 5, rest: 4.6, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#04050a';
    const B=STRIKES.map(k=>{const main=bolt(k.seed,k.x0,-6,k.x1,300,6,.34),br=[];const r=rng(k.seed+50);
      for(let i=0;i<2;i++){const j=8+Math.floor(r()*(main.length-24)),p=main[j],dir=r()>.5?1:-1;br.push(bolt(k.seed+i+70,p[0],p[1],p[0]+dir*(40+r()*50),p[1]+60+r()*60,5,.4));}
      return {main,br};});
    const r=rng(33);const spk=STRIKES.map(()=>Array.from({length:18},()=>{const ang=-Math.PI*(.1+.8*r()),v=40+r()*90;return {vx:Math.cos(ang)*v,vy:Math.sin(ang)*v};}));
    return {ctx:canvas(sp),B,spk};
  },
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);
    const path=(pts)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();};
    const draw=(B,al,w)=>{c.lineJoin='round';c.lineCap='round';
      [[w*7,.14,'rgb(120,90,255)'],[w*3.2,.38,'rgb(140,170,255)'],[w,1,'rgb(255,255,255)']].forEach(([lw,k,col])=>{c.lineWidth=lw;c.strokeStyle=col;c.globalAlpha=al*k;path(B.main);B.br.forEach(b=>{c.globalAlpha=al*k*.7;c.lineWidth=lw*.6;path(b);});});};
    let flash=0;
    bgFill(c,'#070914','#04050a');
    if(!a){                                   /* 연출 전: 가는 직선이 잠깐 나타났다 사라진다 */
      STRIKES.forEach(k=>{const tt=t-k.t;if(tt>=0&&tt<.12){c.globalAlpha=1;c.strokeStyle='#fff';c.lineWidth=1;c.beginPath();c.moveTo(k.x0,0);c.lineTo(k.x1,300);c.stroke();}});
      c.globalAlpha=1;cap(c,'연출 전: 직선 · 충전·번쩍임·충격 없음',16,344);return;
    }
    c.globalCompositeOperation='lighter';
    STRIKES.forEach((k,i)=>{
      const tt=t-k.t,B=s.B[i];
      const ch=seg(t,k.t-.8,k.t);                 /* 충전: 구가 점점 커지고 맥동 */
      if(ch>0&&tt<0){const rr=4+16*E.inC(ch),pul=.7+.3*Math.sin(t*38);glowDot(c,[140,150,255],k.x0,22,rr*3.2*pul,.7*ch);glowDot(c,[220,230,255],k.x0,22,rr*pul,1);}
      if(tt>=0&&tt<.3){const fl=[1,.2,.95,.3,.75,.15][Math.min(5,Math.floor(tt/.05))];flash=Math.max(flash,fl);draw(B,fl,1.4);
        glowDot(c,[160,180,255],k.x1,300,60,.9*fl);}
      if(tt>=.3&&tt<1){const f=1-(tt-.3)/.7;draw(B,.35*f*f,.8);}   /* 잔광 */
      if(tt>=0&&tt<.7){const age=tt;s.spk[i].forEach(p=>{glowDot(c,[200,215,255],k.x1+p.vx*age,300+p.vy*age+.5*160*age*age,2.4,(1-age/.7));});}
      if(tt>=0&&tt<.6){const rp=tt/.6;c.globalAlpha=.5*(1-rp);c.strokeStyle='rgb(150,170,255)';c.lineWidth=1.2;c.beginPath();c.ellipse(k.x1,300,10+rp*70,3+rp*14,0,0,TAU);c.stroke();}
    });
    if(flash>0){c.globalAlpha=.22*flash;c.fillStyle='rgb(120,150,255)';c.fillRect(0,0,640,360);}
    c.globalCompositeOperation='source-over';c.globalAlpha=1;c.fillStyle='#07080f';c.fillRect(0,306,640,54);
    c.globalCompositeOperation='lighter';
    cap(c,'연출 후: 충전 0.8초 → 번쩍임 0.3초(깜빡임) → 잔광 → 충격 파동',16,344);
  }
};
export default demo;
