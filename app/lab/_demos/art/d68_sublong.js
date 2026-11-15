// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d68. 직접 고치지 않는다 — 응용 팁 'sublong' 적용본
/* eslint-disable */
// @ts-nocheck

import { rng, canvas } from "./helpers.js";
import { LX, bgFill, cap, txt2, txtm, uiReset } from "./shared/common.js";
import { AUD, SR, biq, sClock, sFin, sFmt, sLay, sMk, sNear, sNorm, sSpec, sSpecDraw, sStats, sUI, sWave, svfBP } from "./shared/g68.js";

function syn68(after){
  const N=Math.round(3.0*SR),T0=Math.round(.5*SR);
  if(!after){const d=sMk(3);for(let i=T0;i<N;i++){const k=(i-T0)/SR;d[i]=.8*Math.sin(2*Math.PI*220*k)*Math.exp(-k/.12)*Math.min(1,k/.003);}sFin(d,25);sNorm([d],null,.9);return {ch:[d],dur:3,layers:[{n:'사인 220Hz 한 겹',c:'#9ba3ad',d}]};}
  const r=rng(11),pre=sMk(3),sub=sMk(3),body=sMk(3),clk=sMk(3),tail=sMk(3);
  {const bp=svfBP(2.2),n0=Math.round(.35*SR);for(let i=0;i<n0;i++){const u=i/n0;pre[i]=bp(r()*2-1,200*Math.pow(2500/200,u))*u*u;}const f=Math.round(.008*SR);for(let i=0;i<f;i++)pre[n0-1-i]*=i/f;}
  {let ph=0;for(let i=T0;i<N;i++){const k=(i-T0)/SR;ph+=2*Math.PI*(42+68*Math.exp(-k/.18))/SR;sub[i]=Math.sin(ph)*Math.exp(-k/.8)*Math.min(1,k/.004);}}
  {const bp=svfBP(1.1),lp=biq('lp',1200,.7);for(let i=T0;i<N;i++){const k=(i-T0)/SR;body[i]=lp(bp(r()*2-1,260))*Math.exp(-k/.11)*Math.min(1,k/.002);}}
  {const hp=biq('hp',3000,.7);for(let i=T0;i<N;i++){const k=(i-T0)/SR;clk[i]=hp(r()*2-1)*Math.exp(-k/.006)+.45*Math.sin(2*Math.PI*2200*k)*Math.exp(-k/.004);}}
  {const lp=biq('lp',1800,.7),T1=T0+Math.round(.02*SR);for(let i=T1;i<N;i++){const k=(i-T1)/SR;tail[i]=lp(r()*2-1)*(1-Math.exp(-k/.04))*Math.exp(-k/.7);}}
  const L=[{n:'긴장 → 무음(0.35초부터)',c:'#6fd3ff',d:sLay(pre,.3)},{n:'저역 서브(쿵)',c:'#b49cff',d:sLay(sub,.9)},{n:'몸통(노이즈 몸)',c:'#3ecf8e',d:sLay(body,.6)},{n:'어택(딱)',c:'#ffd85c',d:sLay(clk,.5)},{n:'꼬리(울림)',c:'#ff7ac8',d:sLay(tail,.22)}];
  const mix=sMk(3);for(let i=0;i<N;i++){let v=0;L.forEach(l=>v+=l.d[i]);mix[i]=v;}sFin(mix,25);sNorm([mix],L,.9);
  return {ch:[mix],dur:3,layers:L};
}
function bld68(s){const bef=syn68(false),aft=syn68(true);s.B={bef,aft,st:{bef:sStats(bef),aft:sStats(aft)},sp:{bef:sSpec(bef,110,26),aft:sSpec(aft,110,26)}};}

const demo = {
  dur: 3, rest: 1.2, noCompare: false, levels: 0,
  mount(sp){const s={ctx:canvas(sp),sp,key:'d68',B:null,cur:null,build(){bld68(s);}};sUI(sp,s);return s;},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    if(!s.B){if(sNear(s.sp))s.build();else{txt2(c,'소리를 준비하는 중…',320,180,14,'#5b6577',500,'center');return;}}
    const k=s.cur&&AUD.src?s.cur:(a?'aft':'bef'),buf=s.B[k],st=s.B.st[k],sp=s.B.sp[k],ph=sClock(s,t,3)/3,LX=124,LW=496,L=buf.layers;
    txt2(c,k==='aft'?'연출 후 — 5겹':'연출 전 — 사인 한 겹',14,22,12,k==='aft'?'#ffb27f':'#9ba3ad',700);txt2(c,'버튼을 눌러야 소리가 납니다',626,22,10.5,'#5b6577',500,'right');
    L.forEach((l,i)=>{const y=34+i*26;txt2(c,l.n,14,y+15,10,l.c,600);sWave(c,l.d,LX,y,LW,24,l.c,ph,1);});
    const ys=34+Math.max(L.length,5)*26+4;sWave(c,buf.ch[0],LX,ys,LW,40,'#f4efe4',ph,1);txt2(c,'합친 소리',14,ys+24,10.5,'#f4efe4',700);
    const yp=ys+48;sSpecDraw(c,sp,LX,yp,LW,64);txt2(c,'8k',LX-6,yp+8,9,'#5b6577',500,'right');txt2(c,'1k',LX-6,yp+36,9,'#5b6577',500,'right');txt2(c,'100',LX-6,yp+62,9,'#5b6577',500,'right');txt2(c,'스펙트럼',14,yp+36,10.5,'#ffb27f',700);
    c.fillStyle='#ff8a3d';c.fillRect(LX+ph*LW-.7,30,1.4,yp+64-30);
    txtm(c,sFmt(st)+' · 어택 '+st.attackMs.toFixed(0)+'ms',14,yp+80,9.5,'#9ba3ad');
    cap(c,'(측정값만 확인함)',14,yp+96);
  }
};
export default demo;
