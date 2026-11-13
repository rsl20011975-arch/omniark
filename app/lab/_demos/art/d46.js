// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d46. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { canvas, rr } from "./helpers.js";
import { TAU, cap, txtm, uiReset, vn } from "./shared/common.js";

function hhShake(t,imp){
  const n=(f,sd,A)=>(vn(t*f+sd,sd*1.7)-.5)*2*A;
  let x=n(.45,1,7)+n(2.3,5,2.8)+n(9,9,.7),y=n(.5,3,5)+n(2.1,7,2.4)+n(8.3,2,.6),r=(n(.4,11,.7)+n(2.6,13,.3))*Math.PI/180;
  if(imp&&t>3.4){const k=t-3.4,A=14*Math.exp(-k*7);x+=A*Math.sin(k*55);y+=A*.6*Math.cos(k*47);r+=A*.05*Math.sin(k*40)*Math.PI/180*3;}
  return {x,y,r,z:1.07+.006*Math.sin(t*1.7)};
}
function hhScene(c){
  const wg=c.createLinearGradient(0,0,0,250);wg.addColorStop(0,'#1c2438');wg.addColorStop(1,'#0e1220');c.fillStyle=wg;c.fillRect(-40,-40,720,420);
  c.fillStyle='rgba(255,214,150,.07)';c.beginPath();c.moveTo(-40,-40);c.lineTo(250,-40);c.lineTo(420,260);c.lineTo(90,260);c.closePath();c.fill();
  rr(c,60,50,150,130,6);c.fillStyle='#2a3550';c.fill();rr(c,66,56,138,118,4);c.fillStyle='#9fc2e8';c.fill();const sg=c.createLinearGradient(0,56,0,174);sg.addColorStop(0,'#f6d9a6');sg.addColorStop(1,'#8fb5e0');c.fillStyle=sg;rr(c,66,56,138,118,4);c.fill();
  c.fillStyle='#2a3550';c.fillRect(133,56,4,118);c.fillRect(66,113,138,4);
  rr(c,420,64,130,160,5);c.fillStyle='#e9dfc9';c.fill();rr(c,430,74,110,100,3);const pg=c.createLinearGradient(430,74,540,174);pg.addColorStop(0,'#ff9c58');pg.addColorStop(1,'#c4561a');c.fillStyle=pg;c.fill();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(470,110,16,0,TAU);c.fill();
  c.fillStyle='#8a6e5a';c.fillRect(430,190,70,5);c.fillStyle='#b3a48e';c.fillRect(430,202,48,4);
  const tg=c.createLinearGradient(0,248,0,360);tg.addColorStop(0,'#4a3428');tg.addColorStop(1,'#1c120d');c.fillStyle=tg;c.fillRect(-40,248,720,140);c.fillStyle='rgba(255,230,190,.25)';c.fillRect(-40,248,720,2);
  const cg=c.createLinearGradient(250,0,330,0);cg.addColorStop(0,'#f6eee0');cg.addColorStop(1,'#cbbfa6');c.fillStyle=cg;rr(c,255,196,76,58,10);c.fill();c.strokeStyle='#e8dcc4';c.lineWidth=7;c.beginPath();c.arc(338,222,15,-1.2,1.2);c.stroke();
  c.fillStyle='#3a2216';c.beginPath();c.ellipse(293,198,35,7,0,0,TAU);c.fill();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;c.beginPath();c.moveTo(285,184);c.bezierCurveTo(279,170,296,164,288,150);c.moveTo(300,184);c.bezierCurveTo(294,172,310,166,303,154);c.stroke();
  c.fillStyle='#2d5a46';[[100,238,-.6],[118,230,0],[136,238,.6]].forEach(l=>{c.save();c.translate(l[0],l[1]);c.rotate(l[2]);c.beginPath();c.ellipse(0,-22,10,26,0,0,TAU);c.fill();c.restore();});c.fillStyle='#a5522a';rr(c,92,236,52,22,4);c.fill();
  [['#7a2f2a',50],['#2a4a6a',40],['#c9a24a',34]].forEach((b,i)=>{c.fillStyle=b[0];c.fillRect(470,252-i*16-14,b[1]+20,14);});
}

const demo = {
  dur: 5.2, rest: 2.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0d16';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);
    const sh=a?hhShake(t,true):{x:0,y:0,r:0,z:1};
    c.save();c.translate(320,180);c.rotate(sh.r);c.scale(sh.z,sh.z);c.translate(-320+sh.x,-180+sh.y);hhScene(c);c.restore();
    if(a&&t>3.4&&t<3.55){c.fillStyle='rgba(255,255,255,'+.3*(1-(t-3.4)/.15)+')';c.fillRect(0,0,640,360);}
    rr(c,14,274,164,70,8);c.fillStyle='rgba(6,8,14,.78)';c.fill();c.strokeStyle='#262e3d';c.lineWidth=1;c.stroke();
    txtm(c,a?(t<3.4?'HANDHELD  노이즈 3겹 + 롤':'IMPACT  사인 × 지수 감쇠'):'TRIPOD  고정',22,290,9,a&&t>=3.4?'#ff8a3d':'#6fd3ff');
    c.save();c.beginPath();c.rect(18,296,156,44);c.clip();c.strokeStyle=a&&t>=3.4?'#ff8a3d':'#6fd3ff';c.lineWidth=1.4;c.beginPath();
    for(let i=0;i<=78;i++){const tt=t-2+i*2/78,v=a?hhShake(Math.max(0,tt),true).x:0;const px=18+i*2,py=318-v*1.2;i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();
    c.strokeStyle='#262e3d';c.beginPath();c.moveTo(18,318);c.lineTo(174,318);c.stroke();c.restore();
    cap(c,a?'느린 떠다님 + 중간·미세 떨림 + 기울기 → 3.4초 충격은 사인 × 지수 감쇠':'연출 전: 삼각대로 고정, 완전히 정지 → 현장감이 없음',16,350);
  }
};
export default demo;
