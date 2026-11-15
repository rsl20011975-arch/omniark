// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d73. 직접 고치지 않는다 — 응용 팁 'pluck' 적용본
/* eslint-disable */
// @ts-nocheck

import { el, canvas, rr } from "./helpers.js";
import { LX, PL, TAU, bgFill, cap, txt2, txtm, uiReset } from "./shared/common.js";
import { AUD, SR, osc, sClock, sFin, sFmt, sMk, sNear, sNorm, sStats, sUI, sWave } from "./shared/g68.js";

function syn73(after){
  const dur=3.6,N=Math.round(dur*SR),PL=[{t:.3,f:440,pan:-.85},{t:1.2,f:523.25,pan:0},{t:2.1,f:659.25,pan:.85}],dry=sMk(dur),dl=sMk(dur),dr=sMk(dur);
  PL.forEach(p=>{const i0=Math.round(p.t*SR);for(let j=0;j<Math.round(1*SR)&&i0+j<N;j++){const k=j/SR,v=(osc('tri',p.f*k)*.6+Math.sin(2*Math.PI*p.f*2*k)*.2)*Math.exp(-k/.1)*Math.min(1,k/.002);dry[i0+j]+=v;const th=(p.pan+1)*Math.PI/4;dl[i0+j]+=v*Math.cos(th);dr[i0+j]+=v*Math.sin(th);}});
  if(!after){sNorm([dry],null,.9);const a=Float32Array.from(dry);return {ch:[dry,a],dur,PL,rt:0};}
  const sc=SR/44100,comb=(x,dly,g,damp)=>{const d=Math.round(dly*sc),b=new Float32Array(d),y=new Float32Array(x.length);let ix=0,lv=0;for(let n=0;n<x.length;n++){const o=b[ix];lv=o*(1-damp)+lv*damp;b[ix]=x[n]+lv*g;ix=(ix+1)%d;y[n]=o;}return y;};
  const allp=(x,dly,g)=>{const d=Math.round(dly*sc),b=new Float32Array(d),y=new Float32Array(x.length);let ix=0;for(let n=0;n<x.length;n++){const o=b[ix];y[n]=-x[n]+o;b[ix]=x[n]+o*g;ix=(ix+1)%d;}return y;};
  const rev=(x,off)=>{let y=new Float32Array(x.length);[1557,1617,1491,1422,1277,1188].forEach(dd=>{const c=comb(x,dd+off,.82,.25);for(let i=0;i<y.length;i++)y[i]+=c[i]/6;});[225,556,441,341].forEach(dd=>{y=allp(y,dd+off/3,.5);});return y;};
  const mono=Float32Array.from(dry),wl=rev(mono,0),wr=rev(mono,23);
  const echo=(x,dlySec,fb,g)=>{const d=Math.round(dlySec*SR),y=new Float32Array(x.length);for(let n=0;n<x.length;n++){const prev=n>=d?y[n-d]:0;y[n]=(n>=d?x[n-d]*g:0)+prev*fb;}return y;};
  const el=echo(dl,.27,.38,.5),er=echo(dr,.405,.38,.5),L=sMk(dur),R=sMk(dur);
  for(let i=0;i<N;i++){L[i]=dl[i]+wl[i]*.55+el[i]+er[i]*.2;R[i]=dr[i]+wr[i]*.55+er[i]+el[i]*.2;}
  sFin(L,30);sFin(R,30);sNorm([L,R],null,.9);
  /* 마지막 소리 뒤 −40dB까지 걸리는 시간(50ms 구간 RMS로 측정) */
  const lastEnd=Math.round((2.1+.3)*SR),W=Math.round(.05*SR);let mx=0;const env=[];for(let i=lastEnd;i+W<N;i+=W){let s=0;for(let j=0;j<W;j++)s+=L[i+j]*L[i+j]+R[i+j]*R[i+j];env.push(Math.sqrt(s/(2*W)));if(env[env.length-1]>mx)mx=env[env.length-1];}
  let rt=env.length*.05;for(let i=0;i<env.length;i++)if(20*Math.log10(env[i]/mx+1e-9)<-40){rt=i*.05;break;}
  return {ch:[L,R],dur,PL,rt};
}
function bld73(s){const bef=syn73(false),aft=syn73(true);s.B={bef,aft,st:{bef:sStats(bef),aft:sStats(aft)}};}
function envDb(d,i,w){let s=0;const a=Math.max(0,i-w),b=Math.min(d.length,i+w);for(let j=a;j<b;j++)s+=d[j]*d[j];return 10*Math.log10(s/Math.max(1,b-a)+1e-12);}

const demo = {
  dur: 3.6, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){const s={ctx:canvas(sp),sp,key:'d73',B:null,cur:null,build(){bld73(s);}};sUI(sp,s);return s;},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    if(!s.B){if(sNear(s.sp))s.build();else{txt2(c,'소리를 준비하는 중…',320,180,14,'#5b6577',500,'center');return;}}
    const k=s.cur&&AUD.src?s.cur:(a?'aft':'bef'),buf=s.B[k],st=s.B.st[k],tn=sClock(s,t,3.6),ph=tn/3.6;
    txt2(c,k==='aft'?'연출 후 — 리버브 + 딜레이 + 좌우 배치':'연출 전 — 방 없이 직접 나는 소리만',14,22,12,k==='aft'?'#ffb27f':'#9ba3ad',700);txt2(c,'버튼을 눌러야 소리가 납니다',626,22,10.5,'#5b6577',500,'right');
    /* 위에서 본 방 */
    rr(c,14,34,236,170,8);c.fillStyle='#0e121a';c.fill();c.strokeStyle='#262e3d';c.lineWidth=1.2;c.stroke();
    const LXp=132,LYp=184;c.fillStyle='#dfe5ee';c.beginPath();c.arc(LXp,LYp,6,0,TAU);c.fill();txt2(c,'듣는 사람',LXp,LYp+18,9.5,'#8b94a3',500,'center');
    c.save();rr(c,14,34,236,170,8);c.clip();buf.PL.forEach((p,i)=>{const sx=132+p.pan*92,sy=80,age=tn-p.t;c.fillStyle=age>=0&&age<.5?'#ffb27f':'#ff8a3d';c.beginPath();c.arc(sx,sy,5,0,TAU);c.fill();txt2(c,['왼쪽','가운데','오른쪽'][i],sx,sy-10,9.5,'#9ba3ad',500,'center');
      if(age>0&&age<1.4){c.strokeStyle='rgba(255,138,61,'+(1-age/1.4)*.7+')';c.lineWidth=1.4;c.beginPath();c.arc(sx,sy,age*110,0,TAU);c.stroke();if(k==='aft'){[0,1,2].forEach(q=>{const a2=age-.14*(q+1);if(a2>0){c.strokeStyle='rgba(111,211,255,'+(1-a2/1.4)*.4+')';c.beginPath();c.arc(sx,sy,a2*110,0,TAU);c.stroke();}});}}});
    c.restore();
    /* 좌우 파형과 소리 크기 곡선 */
    const LX=270,LW=350;sWave(c,buf.ch[0],LX,34,LW,46,'#6fd3ff',ph,1);txt2(c,'왼쪽 귀',LX,32,10,'#6fd3ff',700);sWave(c,buf.ch[1],LX,96,LW,46,'#ff8a3d',ph,1);txt2(c,'오른쪽 귀',LX,94,10,'#ff8a3d',700);
    const gy=152,gh=52;rr(c,LX,gy,LW,gh,6);c.fillStyle='#0e121a';c.fill();txtm(c,'소리 크기(dB) — 0 위, −60 아래',LX+6,gy+12,8.5,'#5b6577');c.strokeStyle=k==='aft'?'#3ecf8e':'#9ba3ad';c.lineWidth=1.6;c.beginPath();const d0=buf.ch[0],d1=buf.ch[1];for(let x=0;x<=LW;x+=2){const i=Math.floor(x/LW*d0.length),db=Math.max(-60,(envDb(d0,i,Math.round(.03*SR))+envDb(d1,i,Math.round(.03*SR)))/2),y=gy+4+Math.min(1,-db/60)*(gh-8);x?c.lineTo(LX+x,y):c.moveTo(LX+x,y);}c.stroke();
    c.fillStyle='#ff8a3d';c.fillRect(LX+ph*LW-.7,32,1.4,172);
    txt2(c,k==='aft'?'마지막 소리 뒤 −40dB까지 '+buf.rt.toFixed(1)+'초 울림(측정값)':'마지막 소리 뒤 바로 끊김(울림 없음)',14,226,12,k==='aft'?'#3ecf8e':'#9ba3ad',700);
    txt2(c,'① 직접음(왼·가운데·오른쪽에 배치)  ② 방의 울림(리버브)  ③ 좌우로 번갈아 오는 메아리(딜레이)',14,246,10.5,'#8b94a3',500);
    txtm(c,sFmt(st),14,270,9.5,'#9ba3ad');cap(c,'(측정값만 확인함)',14,310);
  }
};
export default demo;
