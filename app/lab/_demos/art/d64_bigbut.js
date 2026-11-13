// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d64. 직접 고치지 않는다 — 응용 팁 'bigbut' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, bgFill, cap, sstep, txt2, txtm, uiReset } from "./shared/common.js";

const demo = {
  dur: 5.6, rest: 4.4, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const dim=a?sstep(1.2,2.2,t)*(1-sstep(2.5,3.0,t)):0;
    if(!a){ /* 연출 전: 둘 다 처음부터 같이 보임 */
      rr(c,36,70,270,150,12);c.fillStyle='#2a2f3b';c.fill();txt2(c,'흔한 생각',52,94,11,'#9ba3ad',700);txt2(c,'“AI가 만든 영상은',52,140,22,'#dfe5ee',700);txt2(c,'원래 PPT 같다”',52,168,22,'#dfe5ee',700);
      rr(c,334,70,270,150,12);const g=c.createLinearGradient(334,70,604,220);g.addColorStop(0,'#ff9c58');g.addColorStop(1,'#d9501c');c.fillStyle=g;c.fill();txt2(c,'사실',350,94,11,'#fff3e2',700);txt2(c,'문제는 AI가 아니라',350,140,20,'#fff8ea',700);txt2(c,'지시였다',350,168,20,'#fff8ea',700);
      cap(c,'연출 전: 오해와 사실이 동시에 보임 → 기다림도 뒤집히는 순간도 없어 반전이 약함',16,350);return;}
    /* 카드 */
    const x0=320,y0=148,CW=360,CH=150,rise=E.outC(seg(t,.3,.9)),flipA=E.inOutC(seg(t,2.5,3.1))*Math.PI,show=flipA<Math.PI/2?0:1,sx=Math.max(.02,Math.abs(Math.cos(flipA)));
    const tr=t>1.2&&t<2.5?(.3+1.6*sstep(1.2,2.4,t)):0,jx=tr*Math.sin(t*70),jy=tr*.6*Math.cos(t*61);
    c.save();c.translate(x0+jx,y0+jy-(1-rise)*40);c.globalAlpha=rise;c.scale(sx,1);
    c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=26;c.shadowOffsetY=12;rr(c,-CW/2,-CH/2,CW,CH,14);c.fillStyle=show?'#e8662a':'#2a2f3b';c.fill();c.shadowColor='transparent';c.shadowBlur=0;
    if(!show){rr(c,-CW/2+16,-CH/2+14,64,18,9);c.fillStyle='#3a4254';c.fill();txt2(c,'흔한 생각',-CW/2+48,-CH/2+27,10.5,'#cdd5e2',700,'center');txt2(c,'“AI가 만든 영상은',0,-4,28,'#dfe5ee',700,'center');txt2(c,'원래 PPT 같다”',0,32,28,'#dfe5ee',700,'center');
      const st=E.outBack(seg(t,.9,1.2));if(st>0){c.save();c.translate(CW/2-44,-CH/2+30);c.rotate(-.2);c.scale(st,st);c.strokeStyle='#8b94a3';c.lineWidth=2.4;c.beginPath();c.arc(0,0,16,0,TAU);c.stroke();c.beginPath();c.moveTo(-7,0);c.lineTo(-2,6);c.lineTo(8,-6);c.stroke();c.restore();}}
    else{const g=c.createLinearGradient(-CW/2,-CH/2,CW/2,CH/2);g.addColorStop(0,'#ffa862');g.addColorStop(1,'#d9501c');rr(c,-CW/2,-CH/2,CW,CH,14);c.fillStyle=g;c.fill();rr(c,-CW/2+16,-CH/2+14,50,18,9);c.fillStyle='rgba(255,255,255,.28)';c.fill();txt2(c,'반전',-CW/2+41,-CH/2+27,10.5,'#fff8ea',700,'center');txt2(c,'문제는 AI가 아니라',0,-4,26,'#fff8ea',700,'center');txt2(c,'지시였다',0,32,30,'#fff8ea',700,'center');
      const ul=E.outC(seg(t,3.1,3.6));c.fillStyle='#fff8ea';c.fillRect(-60*ul,42,120*ul,3);}
    c.restore();
    /* 긴장: 심장 박동 링과 점 세 개 */
    if(t>1.3&&t<2.5){[1.4,1.9,2.4].forEach(b=>{const q=(t-b)/.5;if(q>0&&q<1){c.strokeStyle='rgba(255,138,61,'+.5*(1-q)+')';c.lineWidth=2;rr(c,x0-CW/2-12*q,y0-CH/2-12*q,CW+24*q,CH+24*q,16+10*q);c.stroke();}});
      [1.3,1.6,1.9].forEach((b,i)=>{if(t>=b){c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.arc(298+i*22,y0+CH/2+30,4,0,TAU);c.fill();}});}
    c.fillStyle='rgba(0,0,0,'+.45*dim+')';c.fillRect(0,0,640,360);
    if(t>2.2&&t<3.6){const q=seg(t,2.2,2.5),sc=1+1.6*(1-E.inC(q)),al=Math.min(1,q*3)*(1-sstep(3.2,3.6,t));c.save();c.globalAlpha=al;c.translate(320,64+(t>2.5?0:0));c.scale(sc,sc);txt2(c,'하지만',0,16,60,'#ffd985',700,'center');c.restore();}
    if(t>=2.5&&t<2.65){c.fillStyle='rgba(255,255,255,'+.5*(1-(t-2.5)/.15)+')';c.fillRect(0,0,640,360);}
    /* 근거 칩 */
    ['같은 모델','다른 지시','다른 결과'].forEach((n,i)=>{const u=E.outC(seg(t,3.3+i*.18,3.8+i*.18));if(u<=0)return;const cx=140+i*180;c.globalAlpha=u;rr(c,cx-60,262+(1-u)*24,120,34,17);c.fillStyle='rgba(255,138,61,.18)';c.fill();c.strokeStyle='#ff8a3d';c.lineWidth=1.2;c.stroke();txt2(c,n,cx,284+(1-u)*24,13,'#ffd9b0',700,'center');if(i<2){txt2(c,'→',cx+90,284+(1-u)*24,16,'#ff8a3d',700,'center');}c.globalAlpha=1;});
    /* 긴장 곡선 */
    const TT=tt=>tt<.3?0:tt<1.2?.25*sstep(.3,1.2,tt):tt<2.4?.25+.6*sstep(1.2,2.4,tt):tt<3.4?.85-.55*sstep(2.4,3.4,tt):.3;
    c.strokeStyle='rgba(255,138,61,.9)';c.lineWidth=1.6;c.beginPath();for(let i=0;i<=80;i++){const tt=i/80*t,px=40+tt/5.6*560,py=326-TT(tt)*26;i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();
    txtm(c,'기다림(pause) 1.0s',40,318,9,'#8b94a3');txtm(c,'긴장',32,306,8.5,'#5b6577','right');
    cap(c,'생각을 세움 → 1.2~2.5초 긴장이 쌓임(떨림·박동·점) → “하지만” → 카드가 뒤집힘',16,350);
  }
};
export default demo;
