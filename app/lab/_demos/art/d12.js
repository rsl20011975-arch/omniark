// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d12. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas } from "./helpers.js";
import { TAU, bgFill, cap, glowDot } from "./shared/common.js";
import { mixc } from "./shared/g11.js";

const FW=[{t:.5,x:190,y:104,col:[255,170,70],n:80,seed:3},{t:1.7,x:440,y:84,col:[110,200,255],n:90,seed:5},{t:2.9,x:315,y:128,col:[255,100,170],n:100,seed:8}];

const demo = {
  dur: 4.8, rest: 4.4, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#05070b';
    const sparks=FW.map(b=>{const r=rng(b.seed);return Array.from({length:b.n},()=>{const ang=r()*TAU,v=80+r()*170;return {vx:Math.cos(ang)*v,vy:Math.sin(ang)*v,k:1.5+r()*.6,life:1.4+r()*.9,ph:r()*TAU,ang};});});
    return {ctx:canvas(sp),sparks};
  },
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);
    bgFill(c,'#070a12','#04050a');
    c.globalCompositeOperation='lighter';
    FW.forEach((b,bi)=>{
      const tt=t-b.t;
      if(!a){                                   /* 연출 전: 같은 속도로 퍼지는 같은 색 점들, 꼬리·중력·번쩍임 없음 */
        if(tt<0||tt>1.3)return;
        s.sparks[bi].forEach(p=>{const sp=95;c.globalAlpha=1;c.fillStyle='rgb('+b.col.join(',')+')';c.beginPath();c.arc(b.x+Math.cos(p.ang)*sp*tt,b.y+Math.sin(p.ang)*sp*tt,2,0,TAU);c.fill();});
        return;
      }
      const rp=seg(t,b.t-.6,b.t);                /* 올라가는 불덩이와 꼬리 */
      if(rp>0&&rp<1){const ry=360-(360-b.y)*E.outC(rp);for(let j=0;j<8;j++){const pp=Math.max(0,rp-j*.022),yy=360-(360-b.y)*E.outC(pp);glowDot(c,[255,226,170],b.x,yy,3.4-j*.3,.8-j*.1);}glowDot(c,[255,240,210],b.x,ry,5,1);}
      if(tt<0)return;
      glowDot(c,mixc(b.col,[255,255,255],.6),b.x,b.y,120*(.4+.6*Math.exp(-tt*6)),.9*Math.exp(-tt*8));     /* 터지는 순간의 번쩍임 */
      s.sparks[bi].forEach(p=>{
        if(tt>p.life)return;
        for(let j=0;j<7;j++){
          const age=tt-j*.026;if(age<0)break;
          const f=age/p.life,e=(1-Math.exp(-p.k*age))/p.k;
          const x=b.x+p.vx*e,y=b.y+p.vy*e+.5*46*age*age;
          const col=f<.18?mixc([255,255,255],b.col,f/.18):(f<.7?b.col:mixc(b.col,[190,50,20],(f-.7)/.3));
          const tw=f>.5?(.55+.45*Math.sin(age*58+p.ph)):1;
          glowDot(c,col,x,y,(2.6-1.4*f)*(1-j*.09),(1-f)*(1-f)*tw*(1-j/7));
        }
      });
    });
    c.globalAlpha=1;cap(c,a?'스파크 270개 · 중력·공기저항·꼬리·색 온도':'연출 전: 같은 속도·같은 색·꼬리 없음',16,344);
  }
};
export default demo;
