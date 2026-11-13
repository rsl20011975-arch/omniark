// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 분야 g32 도우미. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck
import { rr } from "../helpers.js";
import { TAU, txt2 } from "./common.js";

function uiWin(c,x,y,w,h,title){                         /* 창 틀: 그림자 + 제목줄 + 신호등 점 */
  c.save();c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=36;c.shadowOffsetY=14;rr(c,x,y,w,h,12);c.fillStyle='#10141c';c.fill();c.restore();
  rr(c,x,y,w,h,12);c.strokeStyle='#262e3d';c.lineWidth=1;c.stroke();
  c.save();rr(c,x,y,w,h,12);c.clip();c.fillStyle='#161b26';c.fillRect(x,y,w,26);c.fillStyle='#262e3d';c.fillRect(x,y+26,w,1);c.restore();
  ['#ff5f57','#febc2e','#28c840'].forEach((k,i)=>{c.fillStyle=k;c.beginPath();c.arc(x+14+i*14,y+13,4,0,TAU);c.fill();});
  if(title)txt2(c,title,x+w/2,y+17,10.5,'#8b94a3',500,'center');
}
function ckCheck(c,cx,cy,k,col,w){c.save();c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.beginPath();
  const P=[[cx-6,cy+.5],[cx-1.5,cy+5],[cx+6.5,cy-4.5]],L=[Math.hypot(4.5,4.5),Math.hypot(8,9.5)],tot=L[0]+L[1],d=k*tot;
  c.moveTo(P[0][0],P[0][1]);if(d<=L[0]){const u=d/L[0];c.lineTo(P[0][0]+(P[1][0]-P[0][0])*u,P[0][1]+(P[1][1]-P[0][1])*u);}
  else{c.lineTo(P[1][0],P[1][1]);const u=(d-L[0])/L[1];c.lineTo(P[1][0]+(P[2][0]-P[1][0])*u,P[1][1]+(P[2][1]-P[1][1])*u);}c.stroke();c.restore();}

export { uiWin, ckCheck };
