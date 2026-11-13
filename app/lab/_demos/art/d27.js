// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d27. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas } from "./helpers.js";
import { TAU, bgFill, cap, mixrgb, txt2 } from "./shared/common.js";

const MO_N=120;
function moResample(P,N){                 /* 닫힌 점열을 같은 간격 N개로 다시 뽑는다 */
  const q=P.concat([P[0]]),L=[0];for(let i=1;i<q.length;i++)L.push(L[i-1]+Math.hypot(q[i][0]-q[i-1][0],q[i][1]-q[i-1][1]));
  const tot=L[L.length-1],R=[];let j=1;
  for(let k=0;k<N;k++){const d=k/N*tot;while(j<L.length-1&&L[j]<d)j++;const u=(d-L[j-1])/((L[j]-L[j-1])||1);R.push([q[j-1][0]+(q[j][0]-q[j-1][0])*u,q[j-1][1]+(q[j][1]-q[j-1][1])*u]);}
  return R;
}
function moNorm(P){                       /* 가운데로 옮기고 크기를 맞춘다. 시계 방향으로 통일 */
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;P.forEach(p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);});
  const cx=(x0+x1)/2,cy=(y0+y1)/2,sc=1/Math.max(x1-x0,y1-y0);let R=P.map(p=>[(p[0]-cx)*sc,(p[1]-cy)*sc]),ar=0;
  for(let i=0;i<R.length;i++){const p=R[i],q=R[(i+1)%R.length];ar+=p[0]*q[1]-q[0]*p[1];}
  return ar<0?R.reverse():R;
}
function moShapes(){
  const circle=[],star=[],heart=[],drop=[];
  for(let i=0;i<400;i++){const u=i/400*TAU;circle.push([Math.cos(u),Math.sin(u)]);}
  for(let i=0;i<10;i++){const r=i%2?.46:1,u=-Math.PI/2+i*Math.PI/5,A=[Math.cos(u)*r,Math.sin(u)*r],u2=-Math.PI/2+(i+1)*Math.PI/5,r2=(i+1)%2?.46:1,B=[Math.cos(u2)*r2,Math.sin(u2)*r2];
    for(let k=0;k<40;k++)star.push([A[0]+(B[0]-A[0])*k/40,A[1]+(B[1]-A[1])*k/40]);}
  for(let i=0;i<400;i++){const u=i/400*TAU;heart.push([16*Math.pow(Math.sin(u),3),-(13*Math.cos(u)-5*Math.cos(2*u)-2*Math.cos(3*u)-Math.cos(4*u))]);}
  for(let i=0;i<400;i++){const u=i/400*TAU;drop.push([Math.sin(u)*Math.sin(u/2),-Math.cos(u)]);}
  return [circle,star,heart,drop].map(P=>moResample(moNorm(P),MO_N));
}
function moAlign(A,B){                    /* B의 시작점을 돌려 A와 점 사이 거리 합이 가장 작게 맞춘다 */
  let best=0,bd=1e18;for(let r=0;r<MO_N;r++){let d=0;for(let i=0;i<MO_N;i++){const p=A[i],q=B[(i+r)%MO_N];d+=(p[0]-q[0])*(p[0]-q[0])+(p[1]-q[1])*(p[1]-q[1]);}if(d<bd){bd=d;best=r;}}
  return B.map((_,i)=>B[(i+best)%MO_N]);
}
const MO_COL=[[255,138,61],[255,206,84],[255,96,128],[140,110,255],[255,138,61]];
const MO_NAME=['원','별','하트','물방울','원'];
const MO_T0=.7,MO_GAP=1.35,MO_DUR=.95;
function moPath(c,P){                     /* 점들을 부드러운 곡선으로 잇는다 */
  const n=P.length;c.beginPath();c.moveTo((P[n-1][0]+P[0][0])/2,(P[n-1][1]+P[0][1])/2);
  for(let i=0;i<n;i++){const p=P[i],q=P[(i+1)%n];c.quadraticCurveTo(p[0],p[1],(p[0]+q[0])/2,(p[1]+q[1])/2);}c.closePath();
}

const demo = {
  dur: 6.4, rest: 5.9, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#080a10';
    const S=moShapes(),AL=[S[0]];AL.push(moAlign(AL[0],S[1]));AL.push(moAlign(AL[1],S[2]));AL.push(moAlign(AL[2],S[3]));AL.push(moAlign(AL[3],S[0]));
    return {ctx:canvas(sp),S,AL,SEQ:[S[0],S[1],S[2],S[3],S[0]]};
  },
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;
    bgFill(c,'#0b0e16','#06080c');
    const R=92,cx=320,cy=166;
    const k=Math.max(0,Math.min(3,Math.floor((t-MO_T0)/MO_GAP))),st=MO_T0+k*MO_GAP,g=seg(t,st,st+MO_DUR),ge=E.inOutC(g);
    const idx=t<MO_T0?0:(g>=1?k+1:k),col=mixrgb(MO_COL[k],MO_COL[k+1],ge),colS=t<MO_T0?MO_COL[0]:col;
    if(!a){                                   /* 연출 전: 두 모양을 겹쳐 놓고 투명도만 바꾸는 크로스페이드 */
      for(let j=0;j<2;j++){
        const P=s.SEQ[k+j],al=j?ge:1-ge;if(al<=.01)continue;
        const pts=P.map(p=>[cx+p[0]*R*2*.9,cy+p[1]*R*2*.9]);
        c.globalAlpha=al;c.fillStyle='rgb('+MO_COL[k+j].map(Math.round).join(',')+')';moPath(c,pts);c.fill();
      }
      c.globalAlpha=1;cap(c,'연출 전: 모양 두 개를 겹쳐 놓고 투명도만 바꿈 → 중간 모양이 둘 다 흐릿하게 보임',16,344);return;
    }
    const A=s.AL[k],B=s.AL[k+1];let sc=1-.1*Math.sin(Math.PI*g);
    for(let m=0;m<=3;m++){const te=MO_T0+m*MO_GAP+MO_DUR;if(t>te){const u=t-te;sc+=.1*Math.exp(-5.5*u)*Math.sin(20*u);}}
    const pts=[];
    for(let i=0;i<MO_N;i++){
      const d=.15*(1-Math.cos(TAU*i/MO_N)),pp=E.inOutC(seg(t,st+d,st+d+.65)),p=A[i],q=B[i];
      pts.push([cx+(p[0]+(q[0]-p[0])*pp)*R*2*.9*sc,cy+(p[1]+(q[1]-p[1])*pp)*R*2*.9*sc]);
    }
    const sh=c.createRadialGradient(cx,cy+R*1.18,2,cx,cy+R*1.18,R*1.05);sh.addColorStop(0,'rgba(0,0,0,.5)');sh.addColorStop(1,'rgba(0,0,0,0)');
    c.save();c.translate(cx,cy+R*1.18);c.scale(1,.18);c.translate(-cx,-(cy+R*1.18));c.fillStyle=sh;c.fillRect(cx-R*1.3,cy+R*1.18-R*1.3,R*2.6,R*2.6);c.restore();
    const cc=colS.map(Math.round),lt=mixrgb(colS,[255,255,255],.45).map(Math.round),dk=mixrgb(colS,[40,10,5],.45).map(Math.round);
    const gr=c.createLinearGradient(cx-R,cy-R,cx+R,cy+R);gr.addColorStop(0,'rgb('+lt+')');gr.addColorStop(.45,'rgb('+cc+')');gr.addColorStop(1,'rgb('+dk+')');
    c.shadowColor='rgba('+cc+',.45)';c.shadowBlur=34;c.fillStyle=gr;moPath(c,pts);c.fill();c.shadowColor='transparent';c.shadowBlur=0;
    c.save();moPath(c,pts);c.clip();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=5;c.translate(-1.5,-2);moPath(c,pts);c.stroke();c.restore();
    const dotA=Math.sin(Math.PI*g)*.8;
    if(dotA>.02){c.globalAlpha=dotA;c.fillStyle='#fff';for(let i=0;i<MO_N;i+=4){c.beginPath();c.arc(pts[i][0],pts[i][1],1.7,0,TAU);c.fill();}c.globalAlpha=1;}
    const nm=t<MO_T0?MO_NAME[0]:(g<.5?MO_NAME[k]:MO_NAME[k+1]);
    txt2(c,nm,320,330,15,'#ece7dc',700,'center');
    cap(c,'점 '+MO_N+'개가 1:1로 짝지어 이동 · 윤곽을 따라 최대 0.3초 시차 · 도착 때 크기 반동',16,350);
  }
};
export default demo;
