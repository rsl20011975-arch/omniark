// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d67. 직접 고치지 않는다 — 응용 팁 'bigbtn' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, bgFill, cap, clipArt, sstep, txt2, uiReset } from "./shared/common.js";

const demo = {
  dur: 6, rest: 5, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const items=['훅은 약속부터','오해를 세우고 뒤집기','끝에는 행동 하나만'];
    if(!a){ /* 연출 전: 요약도 한꺼번에, 버튼 다섯 개를 동등하게 */
      txt2(c,'오늘 내용 정리',40,56,18,'#dfe5ee',700);items.forEach((x,i)=>{txt2(c,'· '+x,40,92+i*26,15,'#9ba3ad',600);});
      txt2(c,'구독과 좋아요, 알림 설정 부탁드립니다!',320,226,20,'#f4efe4',700,'center');
      ['구독','좋아요','알림','댓글','공유'].forEach((n,i)=>{const x=64+i*108;rr(c,x,250,96,40,10);c.fillStyle=['#ff5f57','#ff8a3d','#ffd85c','#3ecf8e','#6fd3ff'][i];c.fill();txt2(c,n,x+48,276,14,'#10141c',700,'center');});
      cap(c,'연출 전: 요약이 한꺼번에, 요청이 5개 동등하게 → 무엇이 중요한지, 마지막에 뭘 해야 하는지 불분명',16,350);return;}
    const sm=E.outC(seg(t,2.2,2.8));
    /* ① 요약 */
    c.save();c.translate(-40*sm,0);c.globalAlpha=1-sstep(2.2,3.0,t);txt2(c,'오늘의 3가지',40,52,18,'#f4efe4',700);
    items.forEach((x,i)=>{const u=E.outC(seg(t,.4+i*.45,.9+i*.45)),ck=E.outC(seg(t,.8+i*.45,1.2+i*.45)),y=96+i*36;if(u<=0)return;c.globalAlpha=u*(1-sstep(2.2,3.0,t));c.fillStyle='#1a2030';c.beginPath();c.arc(54,y-4,12,0,TAU);c.fill();
      c.strokeStyle='#3ecf8e';c.lineWidth=2.4;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(48,y-4);if(ck<.5){c.lineTo(48+(53-48)*ck*2,y-4+(y+1-(y-4))*ck*2);}else{c.lineTo(53,y+1);c.lineTo(53+(61-53)*(ck-.5)*2,y+1+(y-9-(y+1))*(ck-.5)*2);}c.stroke();c.lineCap='butt';
      txt2(c,x,76,y,16,'#dfe5ee',700);});c.restore();c.globalAlpha=1;
    /* ② 열린 고리 */
    const ol=E.outC(seg(t,2.2,2.9)),cut=t>=3.55;
    if(ol>0&&!cut){c.save();c.globalAlpha=ol;c.translate((1-ol)*60,0);const x=340,y=52,w=270,h=152;
      c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=22;c.shadowOffsetY=10;rr(c,x,y,w,h,12);c.fillStyle='#000';c.fill();c.shadowColor='transparent';c.shadowBlur=0;
      c.save();rr(c,x,y,w,h,12);c.clip();clipArt(c,x,y,w,h,3,t);c.fillStyle='rgba(6,8,14,.72)';c.fillRect(x,y,w,h);txt2(c,'?',x+w/2,y+h/2+34,96,'rgba(255,138,61,.9)',700,'center');c.restore();
      rr(c,x+.5,y+.5,w-1,h-1,12);c.strokeStyle='#ff8a3d';c.lineWidth=1.4;c.stroke();rr(c,x+12,y+12,92,18,9);c.fillStyle='#ff8a3d';c.fill();txt2(c,'NEXT · 다음 편',x+58,y+25,10.5,'#1a0f06',700,'center');
      txt2(c,'같은 지시로 쇼츠도',x+w/2,y+h+30,16,'#f4efe4',700,'center');txt2(c,'만들 수 있을까?',x+w/2,y+h+52,16,'#ffd9b0',700,'center');
      const lp=.85*E.outC(seg(t,2.9,3.5));rr(c,x,y+h+66,w,6,3);c.fillStyle='#1a2030';c.fill();rr(c,x,y+h+66,w*lp,6,3);c.fillStyle='#ff8a3d';c.fill();c.restore();}
    if(t>=3.5&&t<3.62){c.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<6;i++)c.fillRect(0,i*60+((t*900)%40),640,6+i%3*4);}
    /* ③ CTA 하나 */
    const cp=E.outC(seg(t,3.9,4.5));
    if(cp>0){c.save();c.globalAlpha=cp;rr(c,40,52,236,132,12);c.fillStyle='#10141c';c.fill();c.save();rr(c,40,52,236,132,12);c.clip();clipArt(c,40,52,236,132,0,t);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(40,52,236,132);c.restore();rr(c,40.5,52.5,235,131,12);c.strokeStyle='#3a4254';c.lineWidth=1;c.stroke();txt2(c,'다음 영상',54,72,11,'#dfe5ee',700);
      const by=232+(1-cp)*18,pul=.5+.5*Math.sin(t*5);c.shadowColor='rgba(255,138,61,'+(.35+.25*pul)+')';c.shadowBlur=18+10*pul;rr(c,290,by-38,320,72,14);c.fillStyle='#ff8a3d';c.fill();c.shadowColor='transparent';c.shadowBlur=0;
      txt2(c,'블로그에서 전체 지시문 받기  →',450,by+4,17,'#1a0f06',700,'center');
      c.globalAlpha=cp*.7;txt2(c,'구독은 설명란에서',450,by+50,11.5,'#6b7385',500,'center');c.restore();
      c.save();c.globalAlpha=cp;c.strokeStyle='rgba(255,138,61,.6)';c.lineWidth=1.4;c.beginPath();c.moveTo(276,140);c.quadraticCurveTo(300,200,330,196);c.stroke();c.restore();}
    const ph=t<2.2?'① 요약':t<3.8?'② 열린 고리':'③ CTA 하나';rr(c,14,12,120,20,10);c.fillStyle='rgba(0,0,0,.65)';c.fill();txt2(c,ph,26,26,11.5,'#ffb27f',700);
    cap(c,'한 번에 하나씩: 요약 3개 → 다음 편 궁금증(진행 85%에서 멈춤) → 행동 요청 하나(주황 버튼)',16,350);
  }
};
export default demo;
