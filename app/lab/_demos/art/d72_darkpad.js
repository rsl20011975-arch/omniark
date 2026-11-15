// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d72. 직접 고치지 않는다 — 응용 팁 'darkpad' 적용본
/* eslint-disable */
// @ts-nocheck

import { rng, canvas, rr } from "./helpers.js";
import { LX, bgFill, cap, txt2, txtm, uiReset } from "./shared/common.js";
import { AUD, SR, biq, osc, sClock, sFin, sFmt, sLay, sMk, sNear, sNorm, sSpec, sSpecDraw, sStats, sUI } from "./shared/g68.js";

function syn72(after){
  const dur=4,N=Math.round(dur*SR);
  if(!after){const d=sMk(dur);for(let i=0;i<N;i++){const k=i/SR;d[i]=.5*Math.sin(2*Math.PI*220*k)*Math.min(1,k/.04,(dur-k)/.04);}return {ch:[d],dur,layers:[{n:'사인 한 음',c:'#9ba3ad',d}],roll:[{lane:0,t0:0,t1:4,tx:'A3'}]};}
  const CH=[{pad:[220,261.63,329.63],bass:110,arp:[440,523.25,659.25,523.25],n:'Am'},{pad:[174.61,220,261.63],bass:87.31,arp:[349.23,440,523.25,440],n:'F'}];
  const pad=sMk(dur),plk=sMk(dur),bas=sMk(dur),kck=sMk(dur),hat=sMk(dur),roll=[],r=rng(5);
  CH.forEach((c,ci)=>{const t0=ci*2,t1=t0+2.2;c.pad.forEach(f=>{[-.003,0,.003].forEach(dt=>{const fr=f*(1+dt);for(let i=Math.round(t0*SR);i<Math.min(N,Math.round(t1*SR));i++){const k=i/SR-t0;pad[i]+=osc('saw',fr*(i/SR))*.07*Math.min(1,k/.25)*Math.min(1,(t1-t0-k)/.35);}});});roll.push({lane:0,t0:t0,t1:t0+2,tx:c.n});});
  for(let q=0;q<Math.floor((dur-1)/.25);q++){const t0=1+q*.25,ci=t0<2?0:1,f=CH[ci].arp[q%4],i0=Math.round(t0*SR);for(let j=0;j<Math.round(.3*SR)&&i0+j<N;j++){const k=j/SR;plk[i0+j]+=osc('tri',f*k)*Math.exp(-k/.16)*Math.min(1,k/.002);}roll.push({lane:1,t0,t1:t0+.22,tx:''});}
  for(let q=0;q<Math.floor((dur-1)/.25);q++){const t0=1+q*.25,ci=t0<2?0:1,f=CH[ci].bass,i0=Math.round(t0*SR),on=q%2===0,amp=on?.55:.3;for(let j=0;j<Math.round(.28*SR)&&i0+j<N;j++){const k=j/SR;bas[i0+j]+=(osc('tri',f*k)*.7+Math.sin(2*Math.PI*f*k)*.5)*Math.exp(-k/.22)*Math.min(1,k/.004)*amp;}roll.push({lane:2,t0,t1:t0+.22,tx:''});}
  for(let b=0;b<4;b++){const t0=2+b*.5,i0=Math.round(t0*SR);let ph=0;for(let j=0;j<Math.round(.3*SR)&&i0+j<N;j++){const k=j/SR;ph+=2*Math.PI*(45+90*Math.exp(-k/.04))/SR;kck[i0+j]+=Math.sin(ph)*Math.exp(-k/.12)*Math.min(1,k/.002);}roll.push({lane:3,t0,t1:t0+.15,tx:''});}
  for(let q=0;q<8;q++){const t0=2+q*.25,i0=Math.round(t0*SR),hp=biq('hp',7000,.7),on=q%2===1;for(let j=0;j<Math.round(.12*SR)&&i0+j<N;j++){const k=j/SR;hat[i0+j]+=hp(r()*2-1)*Math.exp(-k/.03)*(on?1:.55);}roll.push({lane:4,t0,t1:t0+.1,tx:''});}
  const lp=biq('lp',500,.7);for(let i=0;i<N;i++)pad[i]=lp(pad[i]);
  const L=[{n:'패드(코드)',c:'#6fd3ff',d:sLay(pad,.45)},{n:'아르페지오',c:'#ffd85c',d:sLay(plk,.4)},{n:'베이스',c:'#b49cff',d:sLay(bas,.55)},{n:'킥',c:'#ff7a70',d:sLay(kck,.9)},{n:'하이햇',c:'#3ecf8e',d:sLay(hat,.22)}];
  const mix=sMk(dur);for(let i=0;i<N;i++){let v=0;L.forEach(l=>v+=l.d[i]);mix[i]=v;}sFin(mix,30);sNorm([mix],L,.9);
  return {ch:[mix],dur,layers:L,roll};
}
function bld72(s){const bef=syn72(false),aft=syn72(true);s.B={bef,aft,st:{bef:sStats(bef),aft:sStats(aft)},sp:{bef:sSpec(bef,110,26),aft:sSpec(aft,110,26)}};}

const demo = {
  dur: 4, rest: 3.4, noCompare: false, levels: 0,
  mount(sp){const s={ctx:canvas(sp),sp,key:'d72',B:null,cur:null,build(){bld72(s);}};sUI(sp,s);return s;},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    if(!s.B){if(sNear(s.sp))s.build();else{txt2(c,'소리를 준비하는 중…',320,180,14,'#5b6577',500,'center');return;}}
    const k=s.cur&&AUD.src?s.cur:(a?'aft':'bef'),buf=s.B[k],st=s.B.st[k],sp=s.B.sp[k],tn=sClock(s,t,4),ph=tn/4,LX=96,LW=524,NL=buf.layers.length;
    txt2(c,k==='aft'?'연출 후 — 5층, 2마디(120 BPM · A단조 · Am→F)':'연출 전 — 한 음',14,22,12,k==='aft'?'#ffb27f':'#9ba3ad',700);txt2(c,'버튼을 눌러야 소리가 납니다',626,22,10.5,'#5b6577',500,'right');
    for(let b=0;b<=8;b++){const x=LX+b/8*LW;c.fillStyle=b%4===0?'#3a4254':'#1c2230';c.fillRect(x,34,b%4===0?1.4:1,5*26+4);if(b<8&&b%4===0)txtm(c,(b/4+1)+'마디',x+4,31,8.5,'#8b94a3');}
    buf.layers.forEach((l,i)=>{const y=36+i*26;txt2(c,l.n,14,y+15,10,l.c,600);c.fillStyle='rgba(255,255,255,.03)';c.fillRect(LX,y,LW,24);});
    buf.roll.forEach(e=>{const y=36+e.lane*26,x=LX+e.t0/4*LW,w=Math.max(3,(e.t1-e.t0)/4*LW-1),on=tn>=e.t0;c.fillStyle=on?buf.layers[e.lane].c:buf.layers[e.lane].c+'55';rr(c,x,y+3,w,18,3);c.fill();if(e.tx){txt2(c,e.tx,x+6,y+16,11,'#10141c',700);}});
    c.fillStyle='#ff8a3d';c.fillRect(LX+ph*LW-.7,30,1.4,5*26+10);
    const ys=36+Math.max(NL,5)*26+6;sSpecDraw(c,sp,LX,ys,LW,66);txt2(c,'스펙트럼',14,ys+36,10.5,'#ffb27f',700);
    txtm(c,sFmt(st),14,ys+84,9.5,'#9ba3ad');cap(c,'(측정값만 확인함)',14,310);
  }
};
export default demo;
