// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d70. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { rng, canvas, rr } from "./helpers.js";
import { LX, TAU, bgFill, cap, txt2, txtm, uiReset } from "./shared/common.js";
import { AUD, SR, biq, sClock, sFin, sFmt, sMk, sNear, sNorm, sSpec, sStats, sUI, sWave } from "./shared/g68.js";

const KS_TXT='node build.js';
function syn70(after){
  const dur=3.6,N=Math.round(dur*SR),d=sMk(dur),r=rng(41),ev=[];let t=.4;
  for(let i=0;i<KS_TXT.length+1;i++){const sp=KS_TXT[i]===' ',en=i===KS_TXT.length;
    if(!after)ev.push({t:.4+i*.14,vel:.8,pitch:1,ch:en?'':KS_TXT[i]});
    else{if(i>0)t+=.07+r()*.08+(KS_TXT[i-1]===' '?.14:0)+(en?.3:0);ev.push({t:t+(r()-.5)*.012,vel:en?1:sp?.9:.55+.45*r(),pitch:en?.55:sp?.62:.92+.16*r(),ch:en?'':KS_TXT[i]});}}
  ev.forEach(e=>{const i0=Math.round(e.t*SR),hp=biq('hp',2400,.7),lp=biq('lp',900,.7),rn=rng(Math.round(e.t*1000)+7);
    for(let j=0;j<Math.round(.14*SR)&&i0+j<N;j++){const k=j/SR,n=rn()*2-1;
      const v=hp(n)*Math.exp(-k/.005)*.5+Math.sin(2*Math.PI*170*e.pitch*k*(1-.35*(1-Math.exp(-k/.02))))*Math.exp(-k/.02)*.7+lp(n)*Math.exp(-k/.012)*.25;d[i0+j]+=v*e.vel;}});
  sFin(d,25);sNorm([d],null,.9);return {ch:[d],dur,ev};
}
function bld70(s){const bef=syn70(false),aft=syn70(true),f=b=>{const v=b.ev.map(e=>e.vel),m=v.reduce((p,q)=>p+q,0)/v.length;return Math.sqrt(v.reduce((p,q)=>p+(q-m)*(q-m),0)/v.length);},g=b=>{const iv=[];for(let i=1;i<b.ev.length;i++)iv.push(b.ev[i].t-b.ev[i-1].t);const m=iv.reduce((p,q)=>p+q,0)/iv.length;return Math.sqrt(iv.reduce((p,q)=>p+(q-m)*(q-m),0)/iv.length)*1000;};
  s.B={bef,aft,st:{bef:sStats(bef),aft:sStats(aft)},sp:{bef:sSpec(bef,110,26),aft:sSpec(aft,110,26)},velSd:{bef:f(bef),aft:f(aft)},ivSd:{bef:g(bef),aft:g(aft)}};}

const demo = {
  dur: 3.6, rest: 2.2, noCompare: false, levels: 0,
  mount(sp){const s={ctx:canvas(sp),sp,key:'d70',B:null,cur:null,build(){bld70(s);}};sUI(sp,s);return s;},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    if(!s.B){if(sNear(s.sp))s.build();else{txt2(c,'소리를 준비하는 중…',320,180,14,'#5b6577',500,'center');return;}}
    const k=s.cur&&AUD.src?s.cur:(a?'aft':'bef'),buf=s.B[k],st=s.B.st[k],tn=sClock(s,t,3.6),ph=tn/3.6,LX=40,LW=580;
    txt2(c,k==='aft'?'연출 후 — 세기·높낮이·간격이 제각각':'연출 전 — 같은 소리가 같은 간격으로 반복',14,22,12,k==='aft'?'#ffb27f':'#9ba3ad',700);txt2(c,'버튼을 눌러야 소리가 납니다',626,22,10.5,'#5b6577',500,'right');
    const shown=buf.ev.filter(e=>e.t<=tn).map(e=>e.ch).join('');txt2(c,'$ '+shown+(Math.floor(tn*3)%2===0?'▌':' '),LX,74,26,'#dfe5ee',700);
    /* 키 입력 막대(높이 = 세기, 가로 위치 = 시각) */
    c.fillStyle='#0e121a';rr(c,LX-8,96,LW+16,92,8);c.fill();c.fillStyle='#262e3d';c.fillRect(LX,176,LW,1);
    buf.ev.forEach(e=>{const x=LX+e.t/3.6*LW,h=70*e.vel,on=e.t<=tn;c.fillStyle=on?(k==='aft'?'#ff8a3d':'#9ba3ad'):'#2a3244';rr(c,x-2.5,176-h,5,h,2);c.fill();if(on&&tn-e.t<.12){c.strokeStyle='rgba(255,138,61,'+(1-(tn-e.t)/.12)+')';c.beginPath();c.arc(x,176-h,6+30*(tn-e.t),0,TAU);c.stroke();}});
    txt2(c,'막대 높이 = 세기 · 가로 위치 = 시각',LX,108,10.5,'#8b94a3',500);
    sWave(c,buf.ch[0],LX,196,LW,44,'#6fd3ff',ph,1);c.fillStyle='#ff8a3d';c.fillRect(LX+ph*LW-.7,92,1.4,148);
    txtm(c,'세기 편차 '+s.B.velSd[k].toFixed(2)+' · 간격 편차 '+s.B.ivSd[k].toFixed(0)+'ms · '+sFmt(st),14,262,9.5,'#9ba3ad');
    txtm(c,'편차 0 = 기계적으로 똑같음(사람은 0이 아님)',14,278,9.5,'#5b6577');
    cap(c,'(측정값만 확인함 — 소리는 직접 들어 보고 판단하세요)',14,310);
  }
};
export default demo;
