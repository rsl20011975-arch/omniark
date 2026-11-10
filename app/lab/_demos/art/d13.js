// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d13. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { rng, canvas } from "./helpers.js";
import { TAU, bgFill, cap, glowDot } from "./shared/common.js";

const demo = {
  dur: 8, rest: 3, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#05070b';
    const r=rng(21),mk=(n,f)=>Array.from({length:n},()=>f(r));
    const far=mk(80,r=>({x:r()*640,y:r()*360,ax:6+r()*10,ay:4+r()*8,kx:1+Math.floor(r()*2),ky:1+Math.floor(r()*2),ph:r()*TAU,s:.5+r()*.8,tw:r()*TAU}));
    const mid=mk(36,r=>({x:r()*640,y:r()*360,ax:14+r()*18,ay:10+r()*16,kx:1+Math.floor(r()*2),ky:1+Math.floor(r()*2),ph:r()*TAU,s:1.1+r()*1.2,tw:r()*TAU}));
    const near=mk(10,r=>({x:r()*640,y:r()*360,ax:30+r()*30,ay:20+r()*30,kx:1,ky:1+Math.floor(r()*2),ph:r()*TAU,s:14+r()*16,warm:r()>.5}));
    const fly=mk(14,r=>({x:60+r()*520,y:90+r()*230,ax:20+r()*30,ay:14+r()*24,kx:1+Math.floor(r()*3),ky:1+Math.floor(r()*3),ph:r()*TAU,ph2:r()*TAU,pu:r()*TAU}));
    const base=mk(60,r=>({x:r()*640,y:r()*360}));
    return {ctx:canvas(sp),far,mid,near,fly,base};
  },
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);const P=TAU*t/8;
    if(!a){                                   /* 연출 전: 같은 크기·같은 밝기 점이 같은 속도로 */
      bgFill(c,'#080b12','#05070b');c.globalCompositeOperation='source-over';
      s.base.forEach((p,i)=>{const y=((p.y-t*14)%360+360)%360;c.globalAlpha=.8;c.fillStyle='#fff';c.beginPath();c.arc(p.x,y,1.6,0,TAU);c.fill();});
      c.globalAlpha=1;cap(c,'연출 전: 같은 크기·같은 밝기·같은 속도',16,344);return;
    }
    const g=c.createRadialGradient(150,330,10,150,330,520);g.addColorStop(0,'#1a1410');g.addColorStop(.5,'#0a0d14');g.addColorStop(1,'#04050a');
    c.globalCompositeOperation='source-over';c.globalAlpha=1;c.fillStyle=g;c.fillRect(0,0,640,360);
    c.globalCompositeOperation='lighter';
    const cam=Math.sin(P)*1;                      /* 카메라가 천천히 옆으로 흔들리면 가까운 것이 더 많이 움직인다 */
    const mv=(p,par)=>[p.x+Math.sin(P*p.kx+p.ph)*p.ax-cam*par*8,p.y+Math.cos(P*p.ky+p.ph)*p.ay];
    s.far.forEach(p=>{const [x,y]=mv(p,.3);glowDot(c,[200,215,255],x,y,p.s*2.2,.18+.22*(.5+.5*Math.sin(P*2+p.tw)));});
    s.mid.forEach(p=>{const [x,y]=mv(p,1);glowDot(c,[255,236,210],x,y,p.s*2.6,.32+.2*(.5+.5*Math.sin(P*2+p.tw)));});
    s.near.forEach(p=>{const [x,y]=mv(p,3);glowDot(c,p.warm?[255,170,90]:[120,170,255],x,y,p.s,.09);});
    s.fly.forEach(p=>{const x=p.x+Math.sin(P*p.kx+p.ph)*p.ax,y=p.y+Math.cos(P*p.ky+p.ph2)*p.ay,pu=Math.pow(Math.max(0,Math.sin(P*2+p.pu)),3);
      glowDot(c,[255,214,120],x,y,16,.1+.5*pu);glowDot(c,[255,240,180],x,y,4.2,.35+.65*pu);});
    c.globalCompositeOperation='source-over';c.globalAlpha=1;
    const v=c.createRadialGradient(320,180,150,320,180,420);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.6)');c.fillStyle=v;c.fillRect(0,0,640,360);
    cap(c,'입자 '+(s.far.length+s.mid.length+s.near.length+s.fly.length)+'개 · 멀리/중간/가까이/반딧불 4겹',16,344);
  }
};
export default demo;
