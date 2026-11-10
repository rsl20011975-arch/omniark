// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d63. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { AC, TAU, bgFill, cap, glowDot, txt2, txtm, uiReset } from "./shared/common.js";

function catmull(P,u){                                  /* 점열 P=[[x,y]...]를 부드럽게 지나는 곡선. x가 오름차순이면 u는 x */
  const n=P.length-1;let i=0;while(i<n-1&&P[i+1][0]<u)i++;const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(n,i+2)],f=Math.max(0,Math.min(1,(u-p1[0])/((p2[0]-p1[0])||1))),f2=f*f,f3=f2*f;
  return .5*((2*p1[1])+(-p0[1]+p2[1])*f+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*f2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*f3);
}

const demo = {
  dur: 6.4, rest: 5.8, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const gx=u=>AC.X0+u*(AC.X1-AC.X0),gy=T=>AC.Y1-T*(AC.Y1-AC.Y0),ph=a?E.inOutC(seg(t,.4,5.2)):1;
    [['Act 1 · 설정',0,.25,'111,211,255'],['Act 2 · 대립',.25,.75,'255,138,61'],['Act 3 · 해결',.75,1,'190,150,255']].forEach(b=>{c.fillStyle='rgba('+b[3]+','+(a?.08:.04)+')';c.fillRect(gx(b[1]),AC.Y0-14,gx(b[2])-gx(b[1]),AC.Y1-AC.Y0+28);c.fillStyle='rgba('+b[3]+',.7)';c.fillRect(gx(b[1]),AC.Y0-14,2,AC.Y1-AC.Y0+28);txt2(c,b[0]+'  '+Math.round((b[2]-b[1])*100)+'%',gx(b[1])+8,AC.Y1+12,11,'rgb('+b[3]+')',700);});
    c.strokeStyle='#262e3d';c.lineWidth=1;c.beginPath();c.moveTo(AC.X0,AC.Y1+.5);c.lineTo(AC.X1,AC.Y1+.5);c.stroke();txtm(c,'긴장',AC.X0-4,AC.Y0+8,8.5,'#5b6577','right');txtm(c,'시간 →',AC.X1-4,AC.Y1-4,8.5,'#5b6577','right');
    if(a){const N=Math.floor(160*ph),pts=[];for(let i=0;i<=N;i++){const u=i/160;pts.push([gx(u),gy(catmull(AC.P,u))]);}
      if(pts.length>1){c.beginPath();c.moveTo(pts[0][0],AC.Y1);pts.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(pts[pts.length-1][0],AC.Y1);c.closePath();const fg=c.createLinearGradient(0,AC.Y0,0,AC.Y1);fg.addColorStop(0,'rgba(255,138,61,.28)');fg.addColorStop(1,'rgba(255,138,61,0)');c.fillStyle=fg;c.fill();
        c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle='#ff8a3d';c.lineWidth=2.4;c.lineJoin='round';c.stroke();const hd=pts[pts.length-1];c.globalCompositeOperation='lighter';glowDot(c,[255,160,90],hd[0],hd[1],14,.9);c.globalCompositeOperation='source-over';c.globalAlpha=1;}
      [[.25,'PP1 25%',-1],[.5,'중간점 50%',-1],[.75,'PP2 75%',-1],[.9,'클라이맥스 ~90%',1]].forEach(m=>{if(ph<m[0])return;const x=gx(m[0]),y=gy(catmull(AC.P,m[0])),al=E.outC(seg(ph,m[0],m[0]+.04));c.globalAlpha=al;c.fillStyle='#fff';c.beginPath();c.arc(x,y,3.8,0,TAU);c.fill();c.strokeStyle='rgba(255,255,255,.3)';c.setLineDash([2,3]);c.beginPath();c.moveTo(x,y);c.lineTo(x,AC.Y1);c.stroke();c.setLineDash([]);txtm(c,m[1],x+(m[2]>0?-6:6),y-8,8.5,'#ffd9b0',m[2]>0?'right':'left');c.globalAlpha=1;});}
    else{c.strokeStyle='#4a5266';c.lineWidth=2;c.beginPath();c.moveTo(AC.X0,gy(.3));c.lineTo(AC.X1,gy(.3));c.stroke();txt2(c,'긴장 변화 없음 — 어디가 중요한지 알 수 없음',320,gy(.3)-12,12,'#9ba3ad',600,'center');}
    /* 장면 카드 7장(챕터) */
    const U=a?AC.U:AC.UF;
    U.forEach((u,i)=>{const pop=a?E.outBack(seg(ph,u-.02,u+.04)):1;if(pop<=0)return;const cx=gx(u),w=66,y=214,sc=Math.max(0,pop);
      if(a){c.strokeStyle='rgba(255,255,255,.18)';c.beginPath();c.moveTo(cx,y);c.lineTo(cx,gy(catmull(AC.P,u))+4);c.stroke();}
      c.save();c.translate(cx,y+38);c.scale(sc,sc);c.translate(-cx,-(y+38));rr(c,cx-w/2,y,w,76,8);c.fillStyle='#121722';c.fill();c.strokeStyle=a&&i===3?'#ff8a3d':'#262e3d';c.lineWidth=a&&i===3?1.6:1;c.stroke();
      c.fillStyle=a?(i<1?'#6fd3ff':i<5?'#ff8a3d':'#b49cff'):'#4a5266';c.beginPath();c.arc(cx,y+17,10,0,TAU);c.fill();txt2(c,String(i+1),cx,y+21,11,'#10141c',700,'center');
      txt2(c,AC.N[i],cx,y+46,10.5,'#f4efe4',700,'center');txtm(c,Math.round(u*100)+'%',cx,y+62,8.5,'#8b94a3','center');c.restore();});
    cap(c,a?'1:2:1 비율(25:50:25) 모형 · 긴장이 오르내리고 중간점·위기·클라이맥스가 있음 · 챕터가 그 위치에 놓임':'연출 전: 같은 무게의 7칸 → 긴장 곡선이 없어 어디가 중심인지 모름',16,350);
  }
};
export default demo;
