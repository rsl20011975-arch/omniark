// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d69. 직접 고치지 않는다 — 응용 팁 'rtl' 적용본
/* eslint-disable */
// @ts-nocheck

import { rng, canvas, rr } from "./helpers.js";
import { LX, TAU, bgFill, cap, txt2, txtm, uiReset } from "./shared/common.js";
import { AUD, SR, biq, sClock, sFin, sFmt, sMk, sNear, sNorm, sSpec, sSpecDraw, sStats, sUI, sWave, svfBP } from "./shared/g68.js";

function syn69(after){
  const N=Math.round(2.4*SR),L=sMk(2.4),R=sMk(2.4),r=rng(21);
  if(!after){const n0=Math.round(.3*SR),n1=Math.round(.5*SR);for(let i=0;i<n1;i++){const e=Math.min(1,i/(SR*.005),(n1-i)/(SR*.01)),v=(r()*2-1)*.6*e;L[n0+i]=v;R[n0+i]=v;}sNorm([L,R],null,.9);return {ch:[L,R],dur:2.4};}
  const bp=svfBP(2.2),hp=biq('hp',4000,.7),T0=Math.round(.2*SR),SW=.9;let ph=0;
  for(let i=T0;i<N;i++){const k=(i-T0)/SR,u=k/SW;let v=0;
    if(u<=1){const e=Math.pow(Math.sin(Math.PI*Math.pow(u,.7)),1.4);v+=bp(r()*2-1,300*Math.pow(4500/300,u))*e*1.4;ph+=2*Math.PI*(180*Math.pow(5,u))/SR;v+=Math.sin(ph)*.1*u*u*(1-u);}
    const tk=k-.6*SW;if(tk>0)v+=hp(r()*2-1)*.12*Math.exp(-tk/.35)*Math.min(1,tk/.05);
    const p=Math.min(1,u),gl=Math.sin(p*Math.PI/2),gr=Math.cos(p*Math.PI/2);L[i]=v*gl;R[i]=v*gr;}
  sFin(L,30);sFin(R,30);sNorm([L,R],null,.9);return {ch:[L,R],dur:2.4};
}
function bld69(s){const bef=syn69(false),aft=syn69(true);s.B={bef,aft,st:{bef:sStats(bef),aft:sStats(aft)},sp:{bef:sSpec(bef,110,26),aft:sSpec(aft,110,26)}};}
function balance(buf,ph){const c=Math.round(ph*buf.ch[0].length),w=Math.round(.03*SR);let a=0,b=0;for(let i=Math.max(0,c-w);i<Math.min(buf.ch[0].length,c+w);i++){a+=buf.ch[0][i]*buf.ch[0][i];b+=buf.ch[1][i]*buf.ch[1][i];}return a+b<1e-9?.5:Math.sqrt(b)/(Math.sqrt(a)+Math.sqrt(b));}

const demo = {
  dur: 2.4, rest: 0.9, noCompare: false, levels: 0,
  mount(sp){const s={ctx:canvas(sp),sp,key:'d69',B:null,cur:null,build(){bld69(s);}};sUI(sp,s);return s;},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    if(!s.B){if(sNear(s.sp))s.build();else{txt2(c,'소리를 준비하는 중…',320,180,14,'#5b6577',500,'center');return;}}
    const k=s.cur&&AUD.src?s.cur:(a?'aft':'bef'),buf=s.B[k],st=s.B.st[k],sp=s.B.sp[k],ph=sClock(s,t,2.4)/2.4,LX=60,LW=560;
    txt2(c,k==='aft'?'연출 후 — 필터 훑기 + 좌우 이동':'연출 전 — 평평한 잡음 한 번',14,22,12,k==='aft'?'#ffb27f':'#9ba3ad',700);txt2(c,'버튼을 눌러야 소리가 납니다',626,22,10.5,'#5b6577',500,'right');
    sSpecDraw(c,sp,LX,34,LW,112);txt2(c,'8k',LX-6,44,9,'#5b6577',500,'right');txt2(c,'1k',LX-6,96,9,'#5b6577',500,'right');txt2(c,'100',LX-6,142,9,'#5b6577',500,'right');
    sWave(c,buf.ch[0],LX,152,LW,36,'#6fd3ff',ph,1);txt2(c,'왼쪽',14,174,10.5,'#6fd3ff',700);sWave(c,buf.ch[1],LX,192,LW,36,'#ff8a3d',ph,1);txt2(c,'오른쪽',14,214,10.5,'#ff8a3d',700);
    c.fillStyle='#ff8a3d';c.fillRect(LX+ph*LW-.7,30,1.4,200);
    /* 실제 좌우 균형(왼쪽·오른쪽 소리 크기로 계산) */
    const bl=balance(buf,ph);rr(c,LX,240,LW,6,3);c.fillStyle='#1a2030';c.fill();c.fillStyle='#fff';c.beginPath();c.arc(LX+LW*bl,243,7,0,TAU);c.fill();c.fillStyle='#ff8a3d';c.beginPath();c.arc(LX+LW*bl,243,4,0,TAU);c.fill();txt2(c,'L',LX-14,247,11,'#6fd3ff',700);txt2(c,'R',LX+LW+8,247,11,'#ff8a3d',700);txt2(c,'지금 소리의 좌우 위치(두 귀 소리 크기로 계산)',LX,266,10.5,'#9ba3ad',500);
    txtm(c,sFmt(st),14,292,9.5,'#9ba3ad');cap(c,'(측정값만 확인함 — 소리는 직접 들어 보고 판단하세요)',14,310);
  }
};
export default demo;
