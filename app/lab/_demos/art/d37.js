// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d37. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, bgFill, cap, sstep, txt2, txtm, uiReset } from "./shared/common.js";
import { uiWin } from "./shared/g32.js";

const SK_ROWS=[{t:'2분 만에 배우는 모션 연출',s:'조회 1.2만 · 3일 전',h:[255,178,127],g:[255,106,30]},{t:'숫자가 살아나는 순간',s:'조회 8,400 · 1주 전',h:[111,211,255],g:[40,110,200]},{t:'쇼츠 연출 5가지 비교',s:'조회 3.1만 · 2주 전',h:[190,150,255],g:[100,60,200]}];
function skRects(i){const y=70+i*84;return [[86,y,100,70,8],[202,y+6,230,13,6],[202,y+30,320,9,4.5],[202,y+46,190,9,4.5],[202,y+62,60,8,4]];}

const demo = {
  dur: 5.2, rest: 4.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    uiWin(c,70,30,500,300,'feed.example.com');
    const prog=t<.3?0:t<1?.62*E.outC(seg(t,.3,1)):t<3?.62+.26*E.inOutC(seg(t,1,3)):.88+.12*E.outC(seg(t,3,3.3));
    if(a){const pa=1-sstep(3.5,3.9,t);if(pa>0&&t>.2){c.save();c.beginPath();c.rect(71,57,498,3);c.clip();c.globalAlpha=pa;c.fillStyle='#161b26';c.fillRect(71,57,498,3);c.shadowColor='rgba(255,138,61,.8)';c.shadowBlur=8;c.fillStyle='#ff8a3d';c.fillRect(71,57,498*prog,3);c.restore();c.globalAlpha=pa;txtm(c,'LOADING '+Math.round(prog*100)+'%',560,41,9,'#ff9c58','right');c.globalAlpha=1;}}
    const sx=70-150+((t*.8)%1)*(500+300);
    if(!a&&t<3.2){c.strokeStyle='#2a3446';c.lineWidth=3;c.beginPath();c.arc(320,190,14,0,TAU);c.stroke();c.strokeStyle='#8b94a3';c.beginPath();c.arc(320,190,14,t*6,t*6+1.5);c.stroke();txt2(c,'불러오는 중…',320,226,11,'#5b6577',500,'center');}
    SK_ROWS.forEach((R,i)=>{
      const st=3.2+i*.14,tp=a?E.outC(seg(t,st,st+.45)):(t>=3.2?1:0),sk=a?1-sstep(st,st+.25,t):(t>=3.2?0:0);
      const rects=skRects(i);
      if(a&&sk>0){c.globalAlpha=sk;rects.forEach(r=>{rr(c,r[0],r[1],r[2],r[3],r[4]);c.fillStyle='#1a2030';c.fill();c.save();rr(c,r[0],r[1],r[2],r[3],r[4]);c.clip();const g=c.createLinearGradient(sx-80,0,sx+80,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,.085)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(sx-80,r[1],160,r[3]);c.restore();});c.globalAlpha=1;}
      if(tp>0){const oy=a?(1-tp)*10:0,y=rects[0][1];c.globalAlpha=tp;
        c.save();rr(c,86,y+oy,100,70,8);c.clip();const sc=a?1.07-.07*tp:1,cx=136,cy=y+oy+35;c.translate(cx,cy);c.scale(sc,sc);c.translate(-cx,-cy);
        const g=c.createLinearGradient(86,y,186,y+70);g.addColorStop(0,'rgb('+R.h+')');g.addColorStop(1,'rgb('+R.g+')');c.fillStyle=g;c.fillRect(86,y+oy,100,70);c.fillStyle='rgba(255,255,255,.28)';c.beginPath();c.arc(120,y+oy+22,7,0,TAU);c.fill();c.restore();
        c.fillStyle='rgba(0,0,0,.55)';rr(c,160,y+oy+54,22,12,3);c.fill();txt2(c,'2:14',171,y+oy+63,8.5,'#fff',600,'center');
        txt2(c,R.t,202,y+oy+17,13.5,'#dfe5ee',700);txt2(c,R.s,202,y+oy+36,11,'#8b94a3',500);txt2(c,'예시 화면 · 가상 콘텐츠',202,y+oy+52,10.5,'#5b6577',500);
        rr(c,202,y+oy+58,54,14,7);c.strokeStyle='#2f3b50';c.lineWidth=1;c.stroke();txt2(c,'모션',229,y+oy+68,9,'#8b94a3',600,'center');c.globalAlpha=1;}
    });
    cap(c,a?'상단 진행 바: 빠르게 시작 → 느려지다가 → 끝에 한 번에 100% · 뼈대에 빛이 훑고 지나감 · 내용은 0.14초 간격으로 채워짐':'연출 전: 스피너만 돌다가 3.2초에 모든 내용이 한꺼번에 툭 나타남',16,350);
  }
};
export default demo;
