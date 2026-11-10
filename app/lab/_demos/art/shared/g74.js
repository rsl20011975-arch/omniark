// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 분야 g74 도우미. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck
import { TAU } from "./common.js";

function cbez(x1,y1,x2,y2){return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<10;i++){const mt=1-t,cx=3*mt*mt*t*x1+3*mt*t*t*x2+t*t*t,dx=3*mt*mt*x1+6*mt*t*(x2-x1)+3*t*t*(1-x2);if(Math.abs(dx)<1e-7)break;t-=(cx-x)/dx;t=Math.max(0,Math.min(1,t));}const mt=1-t;return 3*mt*mt*t*y1+3*mt*t*t*y2+t*t*t;};}
function ezPlot(c,fn,x,y,w,h,col,u){                  /* 곡선 그림: 가로 = 시간 0~1, 세로 = 값 0~1.3 */
  c.fillStyle='rgba(255,255,255,.05)';c.fillRect(x,y,w,h);c.strokeStyle='rgba(255,255,255,.15)';c.lineWidth=.8;const y1=y+h-h*(1/1.3);c.beginPath();c.moveTo(x,y1);c.lineTo(x+w,y1);c.stroke();
  c.strokeStyle=col;c.lineWidth=1.6;c.beginPath();for(let i=0;i<=60;i++){const q=i/60,v=fn(q),px=x+q*w,py=y+h-Math.max(0,Math.min(1.3,v))/1.3*h;i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();
  if(u!==undefined){const q=Math.max(0,Math.min(1,u)),v=fn(q);c.fillStyle='#fff';c.beginPath();c.arc(x+q*w,y+h-Math.max(0,Math.min(1.3,v))/1.3*h,2.6,0,TAU);c.fill();}
}
function sprTable(k,c,m,tgtFn,dur){
  const dt=1/2400,sub=10,N=Math.ceil(dur*240)+2,tab=new Float32Array(N);let x=0,v=0;
  for(let i=0;i<N;i++){tab[i]=x;for(let j=0;j<sub;j++){const t=(i*sub+j)*dt,a=(k*(tgtFn(t)-x)-c*v)/m;v+=a*dt;x+=v*dt;}}return tab;
}
function tabAt(tab,t){const f=Math.max(0,Math.min(tab.length-1.001,t*240)),i=Math.floor(f);return tab[i]+(tab[i+1]-tab[i])*(f-i);}

export { cbez, ezPlot, sprTable, tabAt };
