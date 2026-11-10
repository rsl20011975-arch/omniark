// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d83. 직접 고치지 않는다 — 응용 팁 'hero' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, canvas } from "./helpers.js";
import { DV, EZ, TAU, bgFill, cap, dvBar, dvChip, dvHair, txt2, txtk, uiReset } from "./shared/common.js";
import { dvTri } from "./shared/g80.js";

const R83=[['블로그',3.1,3.4],['유튜브',2.2,4.8],['인스타',1.8,2.1],['쇼츠',1.1,5.0],['스레드',1.5,1.4],['뉴스레터',4.5,4.9],['검색',2.6,2.7],['직접',3.8,3.7]];
R83.forEach(r=>{r.d=Math.round((r[2]-r[1])*10)/10;});
const O83=R83.map((r,i)=>i).sort((i,j)=>R83[j].d-R83[i].d),S83=[];
O83.forEach((orig,rank)=>{S83[orig]=rank;});

const demo = {
  dur: 4.4, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const X0=112,K=70,Y=i=>70+i*30,top=R83[O83[0]];
    dvChip(c,a?'덤벨(점 2개 + 선) · 변화순 정렬':'묶음 막대 (막대 16개)',a?232:186,a?'#ffb27f':'#dfe5ee');
    txt2(c,'구독 전환율 (%) 이전 → 이후 · 예시 데이터',X0,56,10.5,DV.muted,600);
    [0,2,4,6].forEach(v=>{dvHair(c,X0+v*K,62,X0+v*K,Y(7)+14,v?DV.grid:DV.axis);txtk(c,v+'%',X0+v*K,Y(7)+28,9.5,DV.muted,'center');});
    [['이전',DV.gray,452],['이후',DV.blue,516]].forEach(l=>{c.fillStyle=l[1];c.beginPath();c.arc(l[2],26,4.5,0,TAU);c.fill();txtk(c,l[0],l[2]+9,30,10,DV.sec);});
    const mv=a?EZ.inOutC(seg(t,2.4,3.2)):0;
    R83.forEach((r,i)=>{
      const yi=Y(a?i+(S83[i]-i)*mv:i),hot=a&&i===O83[0],t0=.3+i*.1;
      txt2(c,r[0],X0-14,yi+4,12,hot&&mv>.5?'#ffd9b0':DV.sec,hot&&mv>.5?700:500,'right');
      const u1=EZ.outBack(seg(t,t0,t0+.25)),u2=EZ.outC(seg(t,t0+.15,t0+.75)),xb=X0+r[1]*K,xa=X0+(r[1]+(r[2]-r[1])*u2)*K;
      if(!a){dvBar(c,X0,yi-9,r[1]*K*EZ.outC(seg(t,t0,t0+.6)),7,2,DV.gray);dvBar(c,X0,yi+1,r[2]*K*EZ.outC(seg(t,t0+.1,t0+.7)),7,2,DV.blue);return;}
      const down=r.d<0,lc=hot?DV.orange:down?DV.bad:'#6b7a95';
      if(u2>0){c.strokeStyle=lc;c.lineWidth=hot?3:2.2;c.lineCap='round';c.beginPath();c.moveTo(xb,yi);c.lineTo(xa,yi);c.stroke();c.lineCap='butt';}
      c.strokeStyle=DV.surf;c.lineWidth=2;c.fillStyle=DV.gray;c.beginPath();c.arc(xb,yi,5.6*u1,0,TAU);c.stroke();c.fill();
      if(u2>0){c.fillStyle=hot?DV.orange:DV.blue;c.beginPath();c.arc(xa,yi,(hot?7:5.6)*Math.min(1,.4+u2),0,TAU);c.stroke();c.fill();}
      if(u2>=1){const dl=(r.d>0?'+':r.d<0?'−':'')+Math.abs(r.d).toFixed(1)+'%p';dvTri(c,556,yi,4,r.d>=0,hot?DV.orange:down?DV.bad:'#6b7a95');txt2(c,dl,624,yi+4,12,hot?'#ffb27f':down?DV.bad:DV.sec,hot?700:500,'right');}
    });
    const dn=R83.filter(r=>r.d<0).length;
    txtk(c,a?'막대 16개 → 점 16개 + 선 8개 · 강조 1개 · 가장 큰 상승 '+top[0]+' +'+top.d.toFixed(1)+'%p · 하락 '+dn+'개(빨강 ▼)':'막대 16개를 눈으로 빼야 한다 — 가장 많이 오른 곳이 어디인지 바로 안 보임 · 강조 0개',16,334,10,a?'#3ecf8e':'#ff7a70');
    cap(c,a?'연출 후: 두 점 사이의 선이 곧 변화량 — 변화순으로 줄을 다시 세우고 가장 큰 상승만 주황':'연출 전: 이전·이후 막대를 나란히 — 차이는 눈으로 뺄셈해야 읽힌다',16,350);
  }
};
export default demo;
