// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d82. 직접 고치지 않는다 — 응용 팁 'teal' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, rng, canvas, rr } from "./helpers.js";
import { DV, EZ, LX, LY, TAU, bgFill, cap, dvChip, sstep, txt2, txtk, uiReset } from "./shared/common.js";

const DV_STOPS=[[0,[16,92,84]],[.5,[30,170,150]],[1,[190,240,230]]];
function dvSeq(u){u=Math.max(0,Math.min(1,u));for(let i=1;i<DV_STOPS.length;i++){if(u<=DV_STOPS[i][0]){const a=DV_STOPS[i-1],b=DV_STOPS[i],p=(u-a[0])/(b[0]-a[0]);return a[1].map((v,k)=>v+(b[1][k]-v)*p);}}return DV_STOPS[DV_STOPS.length-1][1];}
function dvHsl(h,s,l){h/=360;const f=n=>{const k=(n+h*12)%12,a=s*Math.min(l,1-l);return l-a*Math.max(-1,Math.min(k-3,9-k,1));};return [f(0)*255,f(8)*255,f(4)*255];}
function dvRainbow(u){return dvHsl(240*(1-Math.max(0,Math.min(1,u))),.9,.5);}
function dvRgb(a,al){return 'rgba('+Math.round(a[0])+','+Math.round(a[1])+','+Math.round(a[2])+','+(al===undefined?1:al)+')';}
function dvLum(a){const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);};return .2126*f(a[0])+.7152*f(a[1])+.0722*f(a[2]);}
function dvReversals(fn){let prev=dvLum(fn(0)),dir=0,n=0;for(let i=1;i<=64;i++){const l=dvLum(fn(i/64)),d=l-prev;if(Math.abs(d)>1e-4){const s=d>0?1:-1;if(dir&&s!==dir)n++;dir=s;prev=l;}}return n;}
const H82=(function(){
  const r=rng(5),w=[.55,1,.7,.65,.8,.9,.75],V=[];let mx=0;
  for(let d=0;d<7;d++){V.push([]);for(let c=0;c<12;c++){const v=Math.exp(-Math.pow((c-10)/1.7,2))*w[d]*100+Math.exp(-Math.pow((c-4)/1.2,2))*22*w[d]+4+r()*6;V[d].push(v);mx=Math.max(mx,v);}}
  const k=94/mx;let hd=0,hc=0,hv=0;for(let d=0;d<7;d++)for(let c=0;c<12;c++){V[d][c]*=k;if(V[d][c]>hv){hv=V[d][c];hd=d;hc=c;}}
  return {V,hd,hc,hv,revR:dvReversals(dvRainbow),revB:dvReversals(dvSeq)};
})();

const demo = {
  dur: 4.4, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const GX=84,GY=48,CW=40,CH=28,H=H82,days=['월','화','수','목','금','토','일'],col=a?dvSeq:dvRainbow;
    dvChip(c,a?'한 색의 밝기 (청록 1색)':'무지개 색 램프',a?172:150,a?'#ffb27f':'#dfe5ee');
    days.forEach((d,i)=>txt2(c,d,GX-10,GY+i*CH+CH/2+4,11.5,DV.sec,500,'right'));
    for(let i=0;i<=6;i++)txtk(c,i*4+'시',GX+i*2*CW,GY+7*CH+14,9.5,DV.muted,'center');
    for(let d=0;d<7;d++)for(let q=0;q<12;q++){
      const t0=.4+((q/11+d/6)/2)*1.1,u=seg(t,t0,t0+.4);if(u<=.01)continue;const sc=.85+.15*EZ.outC(u),w=(CW-2)*sc,h=(CH-2)*sc,cx=GX+q*CW+(CW-2)/2,cy=GY+d*CH+(CH-2)/2;
      c.globalAlpha=u;rr(c,cx-w/2,cy-h/2,w,h,4);c.fillStyle=dvRgb(col(H.V[d][q]/100));c.fill();c.globalAlpha=1;}
    /* 범례(색 → 값) */
    const LX=GX,LY=284,LW=240;for(let i=0;i<48;i++){c.fillStyle=dvRgb(col(i/47));c.fillRect(LX+i*LW/48,LY,LW/48+.6,10);}
    txtk(c,'0',LX,LY+24,9.5,DV.muted,'center');txtk(c,'100',LX+LW,LY+24,9.5,DV.muted,'center');txtk(c,'낮음 → 높음',LX+LW/2,LY+24,9.5,DV.muted,'center');
    if(a&&t>2.3){const e=EZ.outBack(seg(t,2.3,2.8)),cx=GX+H.hc*CW+(CW-2)/2,cy=GY+H.hd*CH+(CH-2)/2,pul=.5+.5*Math.sin(t*5);
      c.strokeStyle=DV.orange;c.lineWidth=2.2;rr(c,cx-(CW+2)/2*e,cy-(CH+2)/2*e,(CW+2)*e,(CH+2)*e,5);c.stroke();
      c.globalAlpha=sstep(2.6,3.1,t);c.strokeStyle=DV.orange;c.lineWidth=1.6;c.beginPath();c.arc(LX+LW+34,LY+5,6+1.5*pul,0,TAU);c.stroke();txt2(c,days[H.hd]+'요일 '+H.hc*2+'~'+(H.hc*2+2)+'시가 가장 진함 (예시 '+Math.round(H.hv)+')',LX+LW+48,LY+10,11.5,'#ffd9b0',700);c.globalAlpha=1;}
    txtk(c,a?'색의 밝기 순서 뒤집힘 '+H.revB+'번 · 한 색이라 “진할수록 큼”이 한 번에 읽힘 · 범례로 색→값 확인':'색의 밝기 순서가 '+H.revR+'번 뒤집힘 — 초록이 하늘색보다 어두워 “어느 쪽이 큰 값인지” 색만으로는 안 읽힘',16,330,10,a?'#3ecf8e':'#ff7a70');
    cap(c,a?'연출 후: 한 색의 밝기로 크기를 읽고, 가장 진한 칸 하나만 주황 테두리로 짚는다':'연출 전: 무지개 램프 — 색은 화려하지만 값의 순서가 눈에 안 들어온다',16,350);
  }
};
export default demo;
