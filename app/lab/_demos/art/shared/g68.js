// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 분야 g68 도우미. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck
import { AC } from "./common.js";

const SR=32000;
const AUD={ctx:null,src:null,t0:0,dur:0,key:null};
function audStop(){try{if(AUD.src){AUD.src.onended=null;AUD.src.stop();}}catch(e){}AUD.src=null;AUD.key=null;}
function audPlay(buf,key){
  audStop();const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
  if(!AUD.ctx)AUD.ctx=new AC();if(AUD.ctx.state==='suspended')AUD.ctx.resume();
  const ctx=AUD.ctx,n=buf.ch[0].length,ab=ctx.createBuffer(buf.ch.length,n,SR);buf.ch.forEach((d,i)=>ab.getChannelData(i).set(d));
  const src=ctx.createBufferSource();src.buffer=ab;const g=ctx.createGain();g.gain.value=.55;src.connect(g);g.connect(ctx.destination);
  AUD.src=src;AUD.t0=performance.now();AUD.dur=n/SR;AUD.key=key;src.onended=()=>{if(AUD.src===src){AUD.src=null;AUD.key=null;}};src.start();return true;
}
const sMk=sec=>new Float32Array(Math.round(sec*SR));
function biq(type,f,Q){
  const w=2*Math.PI*f/SR,cs=Math.cos(w),sn=Math.sin(w),al=sn/(2*Q);let b0,b1,b2;const a0=1+al,a1=-2*cs,a2=1-al;
  if(type==='lp'){b0=(1-cs)/2;b1=1-cs;b2=b0;}else if(type==='hp'){b0=(1+cs)/2;b1=-(1+cs);b2=b0;}else{b0=al;b1=0;b2=-al;}
  const B0=b0/a0,B1=b1/a0,B2=b2/a0,A1=a1/a0,A2=a2/a0;let x1=0,x2=0,y1=0,y2=0;
  return x=>{const y=B0*x+B1*x1+B2*x2-A1*y1-A2*y2;x2=x1;x1=x;y2=y1;y1=y;return y;};
}
function svfBP(Q){let lo=0,bd=0;const q1=1/Q;return (x,fc)=>{const f=2*Math.sin(Math.PI*Math.min(fc,SR/6.5)/SR);lo+=f*bd;const hi=x-lo-q1*bd;bd+=f*hi;return bd;};}
function sFin(d,fadeMs){const n=Math.round(SR*(fadeMs||20)/1000);for(let i=0;i<n&&i<d.length;i++){d[d.length-1-i]*=i/n;d[i]*=Math.min(1,i/(SR*.002));}}
function sPeak(chs){let p=0;chs.forEach(d=>{for(let i=0;i<d.length;i++){const a=Math.abs(d[i]);if(a>p)p=a;}});return p;}
function sNorm(chs,lay,target){const p=sPeak(chs)||1,k=(target||.9)/p;chs.forEach(d=>{for(let i=0;i<d.length;i++)d[i]*=k;});(lay||[]).forEach(L=>{if(L.scale!==false)for(let i=0;i<L.d.length;i++)L.d[i]*=k;});return k;}
function sStats(buf){
  let pk=0,sq=0,n=0,clip=0,act=0,sqa=0;const thr=Math.pow(10,-60/20);
  buf.ch.forEach(d=>{for(let i=0;i<d.length;i++){const a=Math.abs(d[i]);if(a>pk)pk=a;sq+=a*a;n++;if(a>=.999)clip++;if(a>thr){act++;sqa+=a*a;}}});
  const d0=buf.ch[0];let t10=-1,tp=0;for(let i=0;i<d0.length;i++){const a=Math.abs(d0[i]);if(t10<0&&a>=pk*.1){t10=i;}if(a>=pk*.98){tp=i;break;}}
  return {peak:20*Math.log10(pk||1e-9),rms:10*Math.log10(sq/n+1e-12),rmsActive:10*Math.log10(sqa/(act||1)+1e-12),clip,dur:buf.ch[0].length/SR,attackMs:Math.max(0,(tp-t10)/SR*1000),dc:buf.ch[0].reduce((p,q)=>p+q,0)/buf.ch[0].length};
}
function sSpec(buf,T,F){ /* 간단한 스펙트로그램: 대역 F개(60Hz~8kHz, 로그 간격) × 시간 T칸, 0~1 */
  T=T||100;F=F||26;const d=buf.ch.length>1?buf.ch[0].map((v,i)=>(v+buf.ch[1][i])/2):buf.ch[0],N=d.length,W=768,v=new Float32Array(T*F),fr=[];for(let b=0;b<F;b++)fr.push(60*Math.pow(8000/60,b/(F-1)));
  let mx=-1e9;const hann=new Float32Array(W);for(let i=0;i<W;i++)hann[i]=.5-.5*Math.cos(2*Math.PI*i/(W-1));
  for(let ti=0;ti<T;ti++){const c=Math.round((ti+.5)*N/T),s0=c-W/2;for(let b=0;b<F;b++){const w=2*Math.PI*fr[b]/SR,co=2*Math.cos(w);let s1=0,s2=0;for(let i=0;i<W;i++){const j=s0+i,x=(j>=0&&j<N?d[j]:0)*hann[i],s=x+co*s1-s2;s2=s1;s1=s;}const p=s1*s1+s2*s2-co*s1*s2,db=10*Math.log10(p+1e-12);v[ti*F+b]=db;if(db>mx)mx=db;}}
  for(let i=0;i<v.length;i++)v[i]=Math.max(0,Math.min(1,(v[i]-mx+62)/62));return {v,T,F,fr};
}
const _pkc=new WeakMap();
function sPk(d,w){let m=_pkc.get(d);if(!m){m={};_pkc.set(d,m);}if(m[w])return m[w];const mn=new Float32Array(w),mx=new Float32Array(w),n=d.length;for(let x=0;x<w;x++){let lo=1,hi=-1;const a=Math.floor(x*n/w),b=Math.max(a+1,Math.floor((x+1)*n/w));for(let i=a;i<b;i++){const q=d[i];if(q<lo)lo=q;if(q>hi)hi=q;}mn[x]=lo;mx[x]=hi;}return m[w]={mn,mx};}
function sWave(c,d,x,y,w,h,col,ph,gain){
  const P=sPk(d,Math.round(w)),mid=y+h/2,k=h/2*(gain||1);c.fillStyle='rgba(255,255,255,.04)';c.fillRect(x,y,w,h);
  for(let i=0;i<P.mn.length;i++){const played=ph>=0&&i/P.mn.length<=ph;c.fillStyle=played?col:col+'66';const a=mid-P.mx[i]*k,b=mid-P.mn[i]*k;c.fillRect(x+i,a,1,Math.max(1,b-a));}
  c.fillStyle='rgba(255,255,255,.12)';c.fillRect(x,mid,w,.6);
}
function sSpecDraw(c,sp,x,y,w,h,ph){
  const cw=w/sp.T,chh=h/sp.F;for(let ti=0;ti<sp.T;ti++)for(let b=0;b<sp.F;b++){const v=sp.v[ti*sp.F+b];if(v<.04)continue;const r=Math.round(40+215*v),g=Math.round(18+130*v*v),bl=Math.round(60*(1-v)+20);c.fillStyle='rgb('+r+','+g+','+bl+')';c.fillRect(x+ti*cw,y+h-(b+1)*chh,cw+.6,chh+.6);}
  c.strokeStyle='#262e3d';c.lineWidth=1;c.strokeRect(x+.5,y+.5,w-1,h-1);
}
function sFmt(st){return '피크 '+st.peak.toFixed(1)+' dBFS · RMS '+st.rms.toFixed(1)+' dBFS · 클리핑 '+st.clip+'개 · 길이 '+st.dur.toFixed(1)+'초';}
function sUI(sp,s){
  const mk=(lab,left,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=lab;Object.assign(b.style,{position:'absolute',left:left+'px',top:'327px',height:'24px',padding:'0 12px',borderRadius:'12px',border:'1px solid #3a4254',background:'#1b2230',color:'#dfe5ee',font:'600 12px "IBM Plex Sans KR","Malgun Gothic",sans-serif',cursor:'pointer',zIndex:'5'});b.addEventListener('click',fn);sp.appendChild(b);return b;};
  const go=k=>{if(!s.B){s.build();}s.cur=k;audPlay(k==='bef'?s.B.bef:s.B.aft,s.key+k);};
  s.btnA=mk('▶ 연출 전 소리',14,()=>go('bef'));s.btnB=mk('▶ 연출 후 소리',140,()=>go('aft'));s.btnB.style.borderColor='#ff8a3d';s.btnB.style.color='#ffb27f';mk('■ 정지',268,()=>audStop());
}
function sNear(sp){const r=sp.getBoundingClientRect();return r.bottom>-300&&r.top<(window.innerHeight||900)+300;}
function sClock(s,t,dur){ /* 소리가 나는 중이면 소리 시계, 아니면 영상 시계 */
  const pl=AUD.src&&AUD.key&&AUD.key.indexOf(s.key)===0;return pl?Math.min(dur,(performance.now()-AUD.t0)/1000):Math.min(dur,t);
}
function sLay(d,peak){const p=sPeak([d])||1,k=peak/p;for(let i=0;i<d.length;i++)d[i]*=k;return d;}
function osc(type,ph){const p=ph%1;return type==='saw'?2*p-1:type==='tri'?4*Math.abs(p-.5)-1:Math.sin(2*Math.PI*ph);}

export { SR, AUD, audStop, audPlay, sMk, biq, svfBP, sFin, sPeak, sNorm, sStats, sSpec, _pkc, sPk, sWave, sSpecDraw, sFmt, sUI, sNear, sClock, sLay, osc };
