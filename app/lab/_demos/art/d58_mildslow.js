// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d58. 직접 고치지 않는다 — 응용 팁 'mildslow' 적용본
/* eslint-disable */
// @ts-nocheck

import { canvas, rr } from "./helpers.js";
import { TAU, bgFill, cap, hash, sstep, txt2, txtm, uiReset } from "./shared/common.js";

const TR_N=601,TR_TAU=(()=>{const a=new Float32Array(TR_N);let tau=0;for(let i=1;i<TR_N;i++){tau+=trS(i*.01)*.01;a[i]=tau;}return a;})();
function trS(t){return 1+(.5-1)*sstep(1.0,1.4,t)+(0-.5)*sstep(2.4,2.75,t)+(-1-0)*sstep(3.3,3.6,t)+(3-(-1))*sstep(4.4,4.9,t);}
function trTau(t){const f=Math.max(0,Math.min(TR_N-1.001,t*100)),i=Math.floor(f);return TR_TAU[i]+(TR_TAU[i+1]-TR_TAU[i])*(f-i);}
const TR_MIN=Math.min(...TR_TAU),TR_MAX=Math.max(...TR_TAU);

const demo = {
  dur: 6, rest: 2, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0d111b','#06080c');
    const tau=a?trTau(t):t,sp=a?trS(t):1,frz=a&&Math.abs(sp)<.05,rev=a&&sp<-.02,fast=a&&sp>1.5;
    const fl=c.createLinearGradient(0,0,0,250);fl.addColorStop(0,'#10162a');fl.addColorStop(1,'#1a2240');c.fillStyle=fl;c.fillRect(0,0,640,250);
    c.fillStyle='#0a0d18';c.fillRect(0,250,640,20);c.fillStyle='rgba(255,255,255,.1)';c.fillRect(0,250,640,1);
    [60,150,490,580].forEach((x,i)=>{c.fillStyle='rgba(255,255,255,.05)';c.fillRect(x,70+i%2*20,26,180);});
    const pos=q=>[320+210*Math.sin(q*1.05),250-22-140*Math.abs(Math.sin(q*2.6))];
    for(let k=8;k>=1;k--){const q=tau-k*.04,p=pos(q);c.globalAlpha=.3*(1-k/9);c.fillStyle='#ff8a3d';c.beginPath();c.arc(p[0],p[1],20*(1-k*.03),0,TAU);c.fill();}c.globalAlpha=1;
    const p=pos(tau),h=250-22-p[1];c.fillStyle='rgba(0,0,0,'+(.4-h/500)+')';c.beginPath();c.ellipse(p[0],250+3,20+h*.08,5+h*.012,0,0,TAU);c.fill();
    c.save();c.translate(p[0],p[1]);c.rotate(tau*5);const bg=c.createRadialGradient(-7,-8,2,0,0,22);bg.addColorStop(0,'#ffd9b0');bg.addColorStop(.5,'#ff8a3d');bg.addColorStop(1,'#a8420e');c.fillStyle=bg;c.beginPath();c.arc(0,0,20,0,TAU);c.fill();c.strokeStyle='rgba(60,20,0,.45)';c.lineWidth=1.6;c.beginPath();c.moveTo(-20,0);c.lineTo(20,0);c.moveTo(0,-20);c.lineTo(0,20);c.stroke();c.restore();
    if(fast){c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=1;for(let i=0;i<14;i++){const yy=20+hash(i,3)*220,xx=((t*900+hash(i,5)*640)%760)-60;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+90,yy);c.stroke();}}
    if(rev){c.fillStyle='rgba(120,70,255,.12)';c.fillRect(0,0,640,270);}
    if(frz){c.fillStyle='rgba(255,255,255,.05)';for(let x=0;x<640;x+=6)c.fillRect(x,0,1,270);}
    if(a&&t>=2.72&&t<2.95){c.fillStyle='rgba(255,255,255,'+.35*(1-(t-2.72)/.23)+')';c.fillRect(0,0,640,270);}
    /* 속도 표시 */
    const lab=frz?'정지(프리즈)':rev?'거꾸로(리버스)':sp<.9?'슬로우':fast?'빠르게':'보통',col=frz?'#ffffff':rev?'#b49cff':sp<.9?'#6fd3ff':fast?'#ff7ac8':'#dfe5ee';
    txt2(c,Math.round(sp*100)+'%',22,56,36,col,700);txt2(c,lab,24,76,13,col,600);
    /* 시간 지도(그래프) */
    const GX=40,GY=284,GW=560,GH=54;c.fillStyle='rgba(6,8,14,.9)';rr(c,GX-8,GY-8,GW+16,GH+16,8);c.fill();
    const X=tt=>GX+GW*tt/6,Y=q=>GY+GH-(q-TR_MIN)/(TR_MAX-TR_MIN)*GH;
    for(let i=0;i<TR_N-1;i+=2){const tt=i*.01,sv=a?trS(tt):1,q0=a?TR_TAU[i]:tt,q1=a?TR_TAU[Math.min(TR_N-1,i+2)]:tt+.02;c.strokeStyle=sv<-.02?'#b49cff':Math.abs(sv)<.05?'#ffffff':sv<.9?'#6fd3ff':sv>1.5?'#ff7ac8':'#8b94a3';c.lineWidth=2;c.beginPath();c.moveTo(X(tt),a?Y(q0):GY+GH-(q0/6)*GH);c.lineTo(X(tt+.02),a?Y(q1):GY+GH-(q1/6)*GH);c.stroke();}
    const px=X(t),py=a?Y(tau):GY+GH-(t/6)*GH;c.strokeStyle='rgba(255,138,61,.8)';c.lineWidth=1.2;c.beginPath();c.moveTo(px,GY-4);c.lineTo(px,GY+GH+4);c.stroke();c.fillStyle='#ff8a3d';c.beginPath();c.arc(px,py,4,0,TAU);c.fill();
    txtm(c,'장면 시간',GX-4,GY-12,8.5,'#5b6577');txtm(c,'재생 시간 →',GX+GW,GY+GH+18,8.5,'#5b6577','right');
    cap(c,a?'기울기 = 속도 · 느려짐(하늘) → 정지(흰색) → 거꾸로(보라) → 빨라짐(분홍)':'연출 전: 일정한 속도 → 그래프가 직선이라 강조할 순간이 없음',16,350);
  }
};
export default demo;
