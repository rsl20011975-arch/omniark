// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d15. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas } from "./helpers.js";
import { TAU, bgFill, cap, glowDot } from "./shared/common.js";

const demo = {
  dur: 8, rest: 3.4, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#05080d';
    const r=rng(61),N=46;
    const nodes=Array.from({length:N},(_,i)=>({x:i===0?320:30+r()*580,y:i===0?180:24+r()*312,ax:12+r()*26,ay:10+r()*22,kx:1+Math.floor(r()*2),ky:1+Math.floor(r()*2),ph:r()*TAU,ph2:r()*TAU,s:1.6+r()*1.8}));
    return {ctx:canvas(sp),nodes};
  },
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);const P=TAU*t/8;
    bgFill(c,'#07101a','#04070b');
    const pos=s.nodes.map((n,i)=>a?[n.x+Math.sin(P*n.kx+n.ph)*n.ax,n.y+Math.cos(P*n.ky+n.ph2)*n.ay]:[n.x,n.y]);
    if(!a){c.globalCompositeOperation='source-over';c.globalAlpha=.8;c.fillStyle='#cfd6e0';pos.forEach((p,i)=>{c.beginPath();c.arc(p[0],p[1],s.nodes[i].s*.8,0,TAU);c.fill();});
      c.globalAlpha=1;cap(c,'연출 전: 제자리에 멈춘 점들 · 연결 없음',16,344);return;}
    c.globalCompositeOperation='lighter';
    const R=110*E.outC(seg(t,.2,1.6));
    const pulse=[2.2,5.4].map(T=>({T,r:(t-T)*150})).filter(p=>p.r>=0&&p.r<260);
    c.lineWidth=.8;
    for(let i=0;i<pos.length;i++)for(let j=i+1;j<pos.length;j++){
      const d=Math.hypot(pos[i][0]-pos[j][0],pos[i][1]-pos[j][1]);if(d>=R)continue;
      const hl=(i===0||j===0),al=Math.pow(1-d/R,1.3)*(hl?.9:.5);
      c.globalAlpha=al;c.strokeStyle=hl?'rgb(255,150,70)':'rgb(110,200,255)';c.beginPath();c.moveTo(pos[i][0],pos[i][1]);c.lineTo(pos[j][0],pos[j][1]);c.stroke();
    }
    pos.forEach((p,i)=>{
      const n=s.nodes[i];let fl=0;const d0=Math.hypot(p[0]-pos[0][0],p[1]-pos[0][1]);
      pulse.forEach(pu=>{fl=Math.max(fl,Math.max(0,1-Math.abs(d0-pu.r)/18)*(1-pu.r/260));});
      glowDot(c,i===0?[255,150,70]:[120,200,255],p[0],p[1],(i===0?9:n.s*2.6)+fl*10,(i===0?.95:.55)+fl*.45);
    });
    pulse.forEach(pu=>{c.globalAlpha=.55*(1-pu.r/260);c.strokeStyle='rgb(255,160,90)';c.lineWidth=1.2;c.beginPath();c.arc(pos[0][0],pos[0][1],pu.r,0,TAU);c.stroke();});
    c.globalAlpha=1;cap(c,'노드 '+pos.length+'개 · 거리 '+Math.round(R)+'px 안이면 선으로 연결 · 주황=신호 출발점',16,344);
  }
};
export default demo;
