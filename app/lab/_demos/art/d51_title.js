// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d51. 직접 고치지 않는다 — 응용 팁 'title' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { PL, bgFill, cap, mixrgb, sstep, txt2, txtm, uiReset } from "./shared/common.js";
import { rgbs } from "./shared/g50.js";

function relLum(rgb){const f=v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);};return .2126*f(rgb[0])+.7152*f(rgb[1])+.0722*f(rgb[2]);}
function cRatio(a,b){const l1=relLum(a),l2=relLum(b),hi=Math.max(l1,l2),lo=Math.min(l1,l2);return (hi+.05)/(lo+.05);}

const demo = {
  dur: 5.4, rest: 4.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0d14';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const e=a?E.inOutC(seg(t,1.6,3.4)):0,P={x:24,y:34,w:340,h:290};
    const wid=PL.bw.map((v,i)=>v+(PL.gw[i]-v)*e),col=PL.bad.map((v,i)=>mixrgb(v,PL.good[i],e));
    c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=28;c.shadowOffsetY=12;rr(c,P.x,P.y,P.w,P.h,12);c.fillStyle='#10141c';c.fill();c.restore();
    c.save();rr(c,P.x,P.y,P.w,P.h,12);c.clip();let bx=P.x;const bandX=[];wid.forEach((w,i)=>{bandX.push(bx);c.fillStyle=rgbs(col[i]);c.fillRect(bx,P.y,w*P.w+1,P.h);bx+=w*P.w;});c.restore();
    const tCol=mixrgb([150,155,165],[90,95,105],e),bCol=mixrgb([175,175,188],[190,198,212],e),lCol=mixrgb([255,255,255],[26,15,6],e);
    txt2(c,'봄 신상 세일',P.x+20,P.y+70,28,rgbs(tCol),700);txt2(c,'전 품목 최대 40% 할인',P.x+20,P.y+98,13,rgbs(bCol),500);txt2(c,'3월 한 달 · 온라인 한정',P.x+20,P.y+118,11,rgbs(bCol),500);
    rr(c,P.x+20,P.y+P.h-62,130,40,10);c.fillStyle=rgbs(col[2]);c.fill();txt2(c,'지금 보기',P.x+85,P.y+P.h-37,14,rgbs(lCol),700,'center');
    /* 대비비 패널 */
    const RX=392,r1=cRatio(tCol,col[0]),r2=cRatio(bCol,col[0]),r3=cRatio(lCol,col[2]);
    txt2(c,'글자 대비비',RX,46,13,'#dfe5ee',700);txt2(c,'WCAG AA 기준: 보통 글자 4.5 : 1 이상',RX,62,10,'#8b94a3',500);
    [['제목 / 바탕',r1],['본문 / 바탕',r2],['버튼 글자 / 버튼',r3]].forEach((rw,i)=>{const y=96+i*50,ok=rw[1]>=4.5;
      txt2(c,rw[0],RX,y,11.5,'#dfe5ee',600);rr(c,RX,y+8,190,8,4);c.fillStyle='#1a2030';c.fill();rr(c,RX,y+8,Math.max(6,190*Math.min(1,rw[1]/12)),8,4);c.fillStyle=ok?'#3ecf8e':'#ff5f57';c.fill();
      c.fillStyle='#ff8a3d';c.fillRect(RX+190*4.5/12-.5,y+4,1.4,16);txtm(c,rw[1].toFixed(1)+':1',RX+196,y+16,11,ok?'#3ecf8e':'#ff7a70');txt2(c,ok?'통과 ✓':'부족 ✗',RX+250,y,10.5,ok?'#3ecf8e':'#ff7a70',700);});
    /* 색 비율 막대 */
    txt2(c,'색이 차지하는 비율',RX,256,11.5,'#dfe5ee',700);let sx=RX;wid.forEach((w,i)=>{if(w<.005)return;c.fillStyle=rgbs(col[i]);c.fillRect(sx,266,w*232,18);sx+=w*232;});
    c.strokeStyle='#262e3d';c.lineWidth=1;c.strokeRect(RX+.5,266.5,232,18);
    const lab=e>.8?['바탕 60%','보조 30%','강조 10%']:['5색이 20%씩'];txtm(c,lab.join('  ·  '),RX,302,10,e>.8?'#ffb27f':'#8b94a3');
    if(e>.8){c.globalAlpha=sstep(.8,1,e);txt2(c,'강조색(주황)은 버튼 한 곳에만',RX,320,10.5,'#8b94a3',500);c.globalAlpha=1;}
    cap(c,a?'5색 균등 → 바탕 60·보조 30·강조 10 · 대비비는 실제 계산값':'연출 전: 5색이 같은 비율로 경쟁하고 글자는 바탕과 구분이 안 됨',16,350);
  }
};
export default demo;
