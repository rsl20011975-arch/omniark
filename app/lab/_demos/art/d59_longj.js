// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d59. 직접 고치지 않는다 — 응용 팁 'longj' 적용본
/* eslint-disable */
// @ts-nocheck

import { canvas, rr } from "./helpers.js";
import { bgFill, cap, clipArt, hash, txt2, txtm, uiReset } from "./shared/common.js";

const JL={X0:40,SC:93,V:[[0,2.4,0],[2.4,4.2,1],[4.2,6,2]],A_AFTER:[[0,2.4,0,0],[1.2,4.8,1,1],[4.8,6,2,0]],A_BEFORE:[[0,2.4,0,0],[2.4,4.2,1,0],[4.2,6,2,0]],COL:[[111,211,255],[255,138,61],[190,150,255]],NM:['A','B','C']};
function jlWave(c,x,y,w,h,col,seed,t0,t1,tn,dim){const n=Math.floor(w/3);for(let j=0;j<n;j++){const amp=.3+.7*Math.abs(Math.sin(j*.5+seed)*Math.cos(j*.21+seed*.7)),xx=x+j*3,tt=t0+(xx-x)/JL.SC,played=tn>=tt;c.fillStyle='rgba('+col+','+(played?.95:.42)*dim+')';const bh=h*amp;c.fillRect(xx,y+h/2-bh/2,2,bh);}}

const demo = {
  dur: 6, rest: 2.1, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const vshot=t<2.4?0:(t<4.2?1:2),AU=a?JL.A_AFTER:JL.A_BEFORE;
    const act=AU.filter(q=>t>=q[0]&&t<q[1]).map(q=>q[2]),ash=act.length?act[act.length-1]:vshot;
    /* 미리보기 */
    c.save();c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=22;c.shadowOffsetY=10;rr(c,210,18,220,124,8);c.fillStyle='#000';c.fill();c.restore();c.save();rr(c,210,18,220,124,8);c.clip();clipArt(c,210,18,220,124,vshot===0?0:vshot===1?1:2,t);c.restore();rr(c,210.5,18.5,219,123,8);c.strokeStyle='#262e3d';c.lineWidth=1;c.stroke();
    const jcut=a&&t>=1.2&&t<2.4,lcut=a&&t>=4.2&&t<4.8;
    rr(c,210,150,106,20,10);c.fillStyle='rgba('+JL.COL[vshot]+',.2)';c.fill();txt2(c,'화면 ▸ '+JL.NM[vshot],263,164,11,'rgb('+JL.COL[vshot]+')',700,'center');
    rr(c,324,150,106,20,10);c.fillStyle='rgba('+JL.COL[ash]+',.2)';c.fill();txt2(c,'소리 ▸ '+JL.NM[ash],377,164,11,'rgb('+JL.COL[ash]+')',700,'center');
    for(let i=0;i<9;i++){const hh=3+11*hash(i,Math.floor(t*14))*(.5+.5*Math.sin(i*1.3+t*5)**2);c.fillStyle='rgba('+JL.COL[ash]+',.85)';c.fillRect(444+i*5,170-hh,3,hh);}
    const chip=jcut?'J컷 — 다음 장면의 소리가 먼저 들어옴':lcut?'L컷 — 이전 장면의 소리가 남아 있음':(a?'화면과 소리가 따로 이어짐':'일반 컷 — 화면과 소리가 같이 바뀜');
    rr(c,150,176,340,18,9);c.fillStyle=jcut||lcut?'rgba(255,138,61,.25)':'rgba(255,255,255,.06)';c.fill();txt2(c,chip,320,189,11,jcut||lcut?'#ffb27f':'#9ba3ad',700,'center');
    /* 타임라인 */
    const X=q=>JL.X0+q*JL.SC,rowY={V:214,A1:252,A2:282};
    c.fillStyle='#0e121a';rr(c,8,196,624,120,8);c.fill();
    for(let q=0;q<=6;q++){c.fillStyle='#262e3d';c.fillRect(X(q),200,1,6);txtm(c,q+'s',X(q),198,8,'#5b6577','center');}
    txtm(c,'V1',14,232,9,'#8b94a3');txtm(c,'A1',14,269,9,'#8b94a3');txtm(c,'A2',14,299,9,'#8b94a3');
    JL.V.forEach(v=>{const col=JL.COL[v[2]];rr(c,X(v[0])+1,rowY.V,(v[1]-v[0])*JL.SC-2,34,5);c.fillStyle='rgba('+col+',.32)';c.fill();c.strokeStyle='rgb('+col+')';c.lineWidth=1.2;c.stroke();
      txt2(c,JL.NM[v[2]]+'  '+(v[1]-v[0]).toFixed(1)+'s',X(v[0])+8,rowY.V+21,11,'#f4efe4',700);});
    AU.forEach(q=>{const col=JL.COL[q[2]],y=q[3]?rowY.A2:rowY.A1,w=(q[1]-q[0])*JL.SC-2;rr(c,X(q[0])+1,y,w,26,4);c.fillStyle='rgba('+col+',.14)';c.fill();c.strokeStyle='rgba('+col+',.7)';c.lineWidth=1;c.stroke();
      c.save();rr(c,X(q[0])+1,y,w,26,4);c.clip();jlWave(c,X(q[0])+2,y+3,w-2,20,col,q[2]*3+q[3],q[0],q[1],t,1);c.restore();});
    JL.V.slice(1).forEach(v=>{c.strokeStyle='rgba(255,255,255,.28)';c.setLineDash([3,3]);c.beginPath();c.moveTo(X(v[0]),198);c.lineTo(X(v[0]),312);c.stroke();c.setLineDash([]);});
    if(a){txt2(c,'J',X(1.2)-9,rowY.A2+19,12,'#ffb27f',700,'center');txt2(c,'L',X(4.8)+9,rowY.A2+19,12,'#ffb27f',700,'center');
      c.strokeStyle='#ffb27f';c.lineWidth=1.4;c.beginPath();c.moveTo(X(1.2),310);c.lineTo(X(2.4),310);c.moveTo(X(4.2),310);c.lineTo(X(4.8),310);c.stroke();}
    const px=X(t);c.fillStyle='#ff8a3d';c.fillRect(px-.7,196,1.4,116);c.beginPath();c.moveTo(px-5,194);c.lineTo(px+5,194);c.lineTo(px,201);c.closePath();c.fill();
    cap(c,a?'소리 클립이 화면 클립보다 일찍 시작(J)하거나 늦게 끝남(L) → 컷이 부드럽게 이어짐':'연출 전: 화면과 소리가 같은 지점에서 같이 바뀜(스트레이트 컷)',16,352);
  }
};
export default demo;
