// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d71. 직접 고치지 않는다 — 응용 팁 'attack' 적용본
/* eslint-disable */
// @ts-nocheck

import { rng, canvas, rr } from "./helpers.js";
import { LX, TAU, bgFill, cap, txt2, txtm, uiReset } from "./shared/common.js";
import { AUD, SR, sClock, sFin, sFmt, sLay, sMk, sNear, sNorm, sStats, sUI, sWave, svfBP } from "./shared/g68.js";

const DK_PH=[[.4,1.7],[2.2,3.4],[3.9,4.7]];
function syn71(after){
  const dur=5,N=Math.round(dur*SR),r=rng(61),v=sMk(dur),m=sMk(dur),act=new Uint8Array(N);
  const bp1=svfBP(5),bp2=svfBP(6);let ph0=0;
  DK_PH.forEach(p=>{for(let i=Math.round(p[0]*SR);i<Math.round(p[1]*SR)&&i<N;i++)act[i]=1;let t=p[0];
    while(t<p[1]-.06){const sy=.14+r()*.05,f1=450+r()*450,f2=1000+r()*900,i0=Math.round(t*SR),n=Math.round(sy*SR),a=.6+.4*r();
      for(let i=0;i<n&&i0+i<N;i++){const f0=118+14*Math.sin(2*Math.PI*5*(i0+i)/SR)+10*Math.sin(2*Math.PI*1.3*(i0+i)/SR);ph0+=2*Math.PI*f0/SR;let c=0;for(let h=1;h<=14;h++)c+=Math.sin(h*ph0)/h;const e=Math.pow(Math.sin(Math.PI*i/n),1.2);v[i0+i]+=(bp1(c,f1)+.7*bp2(c,f2))*e*a;}
      t+=sy+.04+r()*.03;}});
  sLay(v,.55);
  const ch=[[110,164.81,220,261.63,329.63,392],[87.31,130.81,174.61,220,261.63,329.63]];
  for(let i=0;i<N;i++){const k=i/SR,c=ch[k<2.5?0:1],x=k<2.5?1:Math.min(1,(k-2.5)/.3);let s=0;
    ch[0].forEach((f,j)=>{const g=k<2.5?1:Math.max(0,1-(k-2.5)/.3);if(g>0)s+=g*(2*Math.abs(2*((k*f)%1)-1)-1)*.12;});
    if(k>=2.5)ch[1].forEach(f=>{s+=x*(2*Math.abs(2*((k*f)%1)-1)-1)*.12;});m[i]=s;}
  { /* 가볍게 튀는 반주(말소리와 같은 대역을 가려서 덕킹이 필요해지게) */
    for(let q=0;q<Math.floor(dur/.3);q++){const t0=q*.3,f=(t0<2.5?[440,523.25,659.25,784]:[349.23,440,523.25,659.25])[q%4],i0=Math.round(t0*SR);for(let j=0;j<Math.round(.25*SR)&&i0+j<N;j++){const k=j/SR;m[i0+j]+=Math.sin(2*Math.PI*f*k)*Math.exp(-k/.09)*.3*Math.min(1,k/.002);}}}
  sLay(m,.4);
  const g=new Float32Array(N),aA=Math.exp(-1/(SR*.25)),aR=Math.exp(-1/(SR*.45)),duck=Math.pow(10,-12/20);let gv=1;
  for(let i=0;i<N;i++){const tg=after&&act[i]?duck:1;gv=tg<gv?tg+(gv-tg)*aA:tg+(gv-tg)*aR;g[i]=gv;}
  const mg=sMk(dur),mix=sMk(dur);for(let i=0;i<N;i++){mg[i]=m[i]*g[i];mix[i]=v[i]+mg[i];}
  sFin(mix,25);const k=sNorm([mix],[{d:v},{d:mg}],.9);
  let vs=0,ms=0,cn=0;for(let i=0;i<N;i++)if(act[i]){vs+=v[i]*v[i];ms+=mg[i]*mg[i];cn++;}
  return {ch:[mix],dur,layers:[{n:'목소리(합성한 말소리)',c:'#6fd3ff',d:v},{n:'음악(자동으로 줄어든 뒤)',c:'#b49cff',d:mg},{n:'음악 음량 조절(1=그대로)',c:'#ff8a3d',d:g,line:true}],vsm:20*Math.log10(Math.sqrt(vs/cn)/Math.sqrt(ms/cn)),act};
}
function bld71(s){const bef=syn71(false),aft=syn71(true);s.B={bef,aft,st:{bef:sStats(bef),aft:sStats(aft)}};}

const demo = {
  dur: 5, rest: 1.2, noCompare: false, levels: 0,
  mount(sp){const s={ctx:canvas(sp),sp,key:'d71',B:null,cur:null,build(){bld71(s);}};sUI(sp,s);return s;},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    if(!s.B){if(sNear(s.sp))s.build();else{txt2(c,'소리를 준비하는 중…',320,180,14,'#5b6577',500,'center');return;}}
    const k=s.cur&&AUD.src?s.cur:(a?'aft':'bef'),buf=s.B[k],st=s.B.st[k],ph=sClock(s,t,5)/5,LX=150,LW=470,Ls=buf.layers;
    txt2(c,k==='aft'?'연출 후 — 말할 때 음악을 12dB 줄임':'연출 전 — 음악 음량이 그대로',14,22,12,k==='aft'?'#ffb27f':'#9ba3ad',700);txt2(c,'버튼을 눌러야 소리가 납니다',626,22,10.5,'#5b6577',500,'right');
    DK_PH.forEach(p=>{c.fillStyle='rgba(111,211,255,.07)';c.fillRect(LX+p[0]/5*LW,32,(p[1]-p[0])/5*LW,170);});
    sWave(c,Ls[0].d,LX,34,LW,34,Ls[0].c,ph,1);txt2(c,Ls[0].n,14,56,10,Ls[0].c,600);
    sWave(c,Ls[1].d,LX,72,LW,34,Ls[1].c,ph,1);txt2(c,Ls[1].n,14,94,10,Ls[1].c,600);
    c.fillStyle='rgba(255,255,255,.04)';c.fillRect(LX,110,LW,44);c.strokeStyle='#262e3d';c.beginPath();c.moveTo(LX,110.5);c.lineTo(LX+LW,110.5);c.moveTo(LX,154.5);c.lineTo(LX+LW,154.5);c.stroke();txtm(c,'0 dB',LX-6,115,8.5,'#5b6577','right');txtm(c,'−12',LX-6,153,8.5,'#5b6577','right');
    c.strokeStyle=Ls[2].c;c.lineWidth=1.6;c.beginPath();const g=Ls[2].d,n=g.length;for(let x=0;x<=LW;x+=2){const i=Math.min(n-1,Math.floor(x/LW*n)),db=20*Math.log10(Math.max(g[i],.01)),y=110+Math.min(1,-db/12)*44;x?c.lineTo(LX+x,y):c.moveTo(LX+x,y);}c.stroke();txt2(c,Ls[2].n,14,136,10,Ls[2].c,600);
    sWave(c,buf.ch[0],LX,158,LW,40,'#f4efe4',ph,1);txt2(c,'합친 소리',14,182,10.5,'#f4efe4',700);
    c.fillStyle='#ff8a3d';c.fillRect(LX+ph*LW-.7,30,1.4,172);
    /* 말소리 대비 음악 */
    const dB=buf.vsm,bx=14,by=224,bw=330;txt2(c,'말하는 구간의 목소리 ÷ 음악 (측정값)',bx,by-6,11,'#dfe5ee',700);rr(c,bx,by,bw,10,5);c.fillStyle='#1a2030';c.fill();c.fillStyle='#262e3d';c.fillRect(bx+bw*(10/30),by-3,1.5,16);txtm(c,'0 dB',bx+bw*(10/30),by+25,8.5,'#5b6577','center');txtm(c,'+10',bx+bw*(20/30),by+25,8.5,'#5b6577','center');txtm(c,'−10',bx,by+25,8.5,'#5b6577');
    const px=bx+bw*Math.max(0,Math.min(1,(dB+10)/30));c.fillStyle=dB>=6?'#3ecf8e':'#ff5f57';c.beginPath();c.arc(px,by+5,8,0,TAU);c.fill();txtm(c,(dB>=0?'+':'')+dB.toFixed(1)+' dB',bx+bw+14,by+9,13,dB>=6?'#3ecf8e':'#ff7a70');
    txt2(c,dB>=6?'목소리가 음악보다 6dB 이상 크다 ✓':'음악이 목소리와 비슷하거나 더 크다 ✗',14,268,12,dB>=6?'#3ecf8e':'#ff7a70',700);
    txtm(c,sFmt(st)+'  (RMS는 LUFS가 아님)',14,288,9,'#9ba3ad');cap(c,'(측정값만 확인함)',14,310);
  }
};
export default demo;
