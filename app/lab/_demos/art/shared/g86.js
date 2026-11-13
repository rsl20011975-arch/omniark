// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 분야 g86 도우미. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck
import { rr } from "../helpers.js";
import { ezShadow, txt2 } from "./common.js";

const EN_COL={ink:'#f4efe4',sec:'#c3c2b7',muted:'#8b94a3',orange:'#ff8a3d',cyan:'#6fd3ff',green:'#3ecf8e',violet:'#b49cff',red:'#ff7a70'};
function enCard(c,x,y,w,h,col,al,title,sub){
  c.save();c.globalAlpha*=al;ezShadow(c,x+w/2,y+h+6,w*.46,5,.35);
  const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#2a3040');g.addColorStop(1,'#181c28');rr(c,x,y,w,h,10);c.fillStyle=g;c.fill();c.strokeStyle='rgba(255,255,255,.16)';c.lineWidth=1;c.stroke();
  c.fillStyle=col;rr(c,x+9,y+10,4,h-20,2);c.fill();
  txt2(c,title,x+22,y+h/2-1,Math.min(14,h*.26),EN_COL.ink,700);txt2(c,sub,x+22,y+h/2+h*.24,Math.min(11,h*.2),EN_COL.muted,500);
  c.restore();
}

export { EN_COL, enCard };
