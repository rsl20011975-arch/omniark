// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d32. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, bgFill, cap, mixrgb, sstep, txt2, uiCursor, uiReset } from "./shared/common.js";
import { ckCheck, uiWin } from "./shared/g32.js";

const CK={bx:230,by:176,bw:180,bh:42,P0:[520,296],C:[468,212],P1:[338,199]};
function ckCursor(t){
  const u=E.inOutC(seg(t,.7,1.9)),a=1-u,x=a*a*CK.P0[0]+2*a*u*CK.C[0]+u*u*CK.P1[0],y=a*a*CK.P0[1]+2*a*u*CK.C[1]+u*u*CK.P1[1];
  const d=E.outC(seg(t,3.0,4.0));return [x+(424-x)*d,y+(268-y)*d];
}

const demo = {
  dur: 5.4, rest: 4.4, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    uiWin(c,70,34,500,292,'새 프로젝트 · app.example.com');
    txt2(c,'리포트 이름',100,100,11,'#8b94a3',600);
    rr(c,100,108,440,34,8);c.fillStyle='#0d1118';c.fill();c.strokeStyle='#262e3d';c.lineWidth=1;c.stroke();txt2(c,'봄 신제품 리포트',114,130,13,'#dfe5ee',500);
    const done=a?t>=3.1:t>=2.3,hov=a?sstep(1.45,1.9,t)*(1-sstep(3.0,3.3,t)):0,press=a?sstep(2.15,2.23,t)*(1-sstep(2.3,2.5,t)):0;
    const cx=CK.bx+CK.bw/2,cy=CK.by+CK.bh/2,dk=a?sstep(3.1,3.35,t):(done?1:0);
    /* 버튼 */
    c.save();c.translate(cx,cy);c.scale(1-.04*press,1-.04*press);c.translate(-cx,-cy);
    if(hov>0){c.shadowColor='rgba(255,138,61,'+(.38*hov)+')';c.shadowBlur=20*hov;c.shadowOffsetY=4*hov;}
    rr(c,CK.bx,CK.by,CK.bw,CK.bh,10);const base=mixrgb(mixrgb([255,138,61],[255,162,96],hov),[62,207,142],dk).map(Math.round);
    c.fillStyle='rgb('+base.map(v=>Math.round(v*(1-.1*press)))+')';c.fill();c.shadowColor='transparent';c.shadowBlur=0;
    if(a&&t>2.15&&t<2.9){const u=(t-2.15)/.7;c.save();rr(c,CK.bx,CK.by,CK.bw,CK.bh,10);c.clip();c.globalAlpha=.42*(1-u);c.fillStyle='#fff';c.beginPath();c.arc(CK.P1[0],CK.P1[1],110*E.outC(u),0,TAU);c.fill();c.restore();}
    if(!done&&(!a||t<2.3)){txt2(c,'생성하기',cx,cy+5,14,'#1a0f06',700,'center');}
    else if(a&&t<3.1){c.strokeStyle='#1a0f06';c.lineWidth=2.4;c.lineCap='round';c.beginPath();const st=t*8;c.arc(cx,cy,9,st,st+1.7);c.stroke();}
    else{ckCheck(c,cx-26,cy+.5,a?E.outC(seg(t,3.1,3.45)):1,'#06210f',2.6);txt2(c,'완료',cx+4,cy+5,14,'#06210f',700,'center');}
    c.restore();
    /* 결과 카드와 빈 화면 안내 */
    const ck=a?E.outC(seg(t,3.35,3.85)):(done?1:0);
    if(ck<1){c.globalAlpha=1-ck;txt2(c,'아직 만든 리포트가 없어요',320,282,12,'#5b6577',500,'center');c.globalAlpha=1;}
    if(ck>0){c.globalAlpha=ck;const oy=(1-ck)*14;rr(c,100,246+oy,440,58,10);c.fillStyle='#161c28';c.fill();c.strokeStyle='#2a3446';c.stroke();
      const g=c.createLinearGradient(112,256,164,300);g.addColorStop(0,'#ffb27f');g.addColorStop(1,'#ff6a1e');rr(c,112,256+oy,52,38,6);c.fillStyle=g;c.fill();
      txt2(c,'봄 신제품 리포트 · 초안',176,274+oy,13,'#dfe5ee',600);txt2(c,'12장 · 방금 만들었어요',176,292+oy,11,'#8b94a3',500);c.globalAlpha=1;}
    /* 토스트 */
    const tk=a?seg(t,3.1,3.6):(done?1:0);
    if(tk>0){const ob=a?E.outBack(tk):1,x=394+(1-ob)*44;c.globalAlpha=a?E.outC(seg(t,3.1,3.35)):1;
      c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=18;c.shadowOffsetY=6;rr(c,x,64,168,40,10);c.fillStyle='#1b2230';c.fill();c.restore();rr(c,x,64,168,40,10);c.strokeStyle='#2f3b50';c.stroke();
      c.fillStyle='#3ecf8e';c.beginPath();c.arc(x+20,84,9,0,TAU);c.fill();ckCheck(c,x+20,84,1,'#06210f',2);txt2(c,'프로젝트를 만들었어요',x+36,88,11.5,'#dfe5ee',600);c.globalAlpha=1;}
    if(a){const p=ckCursor(t),sc=1-.16*sstep(2.15,2.23,t)+.16*E.outBack(seg(t,2.3,2.5));uiCursor(c,p[0],p[1],t<.4?E.outC(seg(t,0,.4)):sc);}
    cap(c,a?'곡선 경로 + 감속 → 호버(밝아짐) → 눌림 0.08초 + 리플 → 스피너 → 완료 · 토스트 · 카드 차례로':'연출 전: 커서·눌림이 없고 결과만 튀어나옴 → 무엇을 눌러서 생긴 건지 안 보임',16,348);
  }
};
export default demo;
