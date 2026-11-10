// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d89. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { EZ, TAU, bgFill, bolt, cap, ezBall, sstep, txt2, txtk, uiReset } from "./shared/common.js";
import { EN_COL } from "./shared/g86.js";

function plMake(pts){const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));return {pts,cum,len:cum[cum.length-1]};}
function plMulti(parts){return {parts,len:parts.reduce((s,p)=>s+p.len,0)};}
function plDraw(c,M,f){          /* M 의 앞쪽 f(0~1)만 그리고, 펜 끝 좌표를 돌려준다 */
  let L=M.len*Math.max(0,Math.min(1,f)),tip=M.parts[0].pts[0];
  for(const P of M.parts){
    if(L<=0)break;const e=Math.min(L,P.len);c.beginPath();c.moveTo(P.pts[0][0],P.pts[0][1]);tip=P.pts[0];
    for(let i=1;i<P.pts.length;i++){
      if(P.cum[i]<=e){c.lineTo(P.pts[i][0],P.pts[i][1]);tip=P.pts[i];}
      else{const k=(e-P.cum[i-1])/(P.cum[i]-P.cum[i-1]);tip=[P.pts[i-1][0]+(P.pts[i][0]-P.pts[i-1][0])*k,P.pts[i-1][1]+(P.pts[i][1]-P.pts[i-1][1])*k];c.lineTo(tip[0],tip[1]);break;}
    }
    c.stroke();L-=P.len;
  }
  return tip;
}
const S89=(function(){
  const un=[];for(let i=0;i<=60;i++){const q=i/60;un.push([q*170,6*Math.sin(q*Math.PI*2.2)-q*5]);}
  const cv=[];for(let i=0;i<=40;i++){const q=i/40,m=1-q;cv.push([3*m*m*q*50+3*m*q*q*110+q*q*q*160,m*m*m*44+3*m*m*q*(-16)+3*m*q*q*(-18)+q*q*q*10]);}
  const e=cv[40],p=cv[37],an=Math.atan2(e[1]-p[1],e[0]-p[0]),bl=[e[0]-14*Math.cos(an-.5),e[1]-14*Math.sin(an-.5)],br=[e[0]-14*Math.cos(an+.5),e[1]-14*Math.sin(an+.5)];
  const ci=[];for(let i=0;i<=48;i++){const g=-Math.PI/2+i/48*TAU;ci.push([28*Math.cos(g),28*Math.sin(g)]);}
  const bolt=[[7,-32],[-14,4],[-2,4],[-8,32],[15,-8],[2,-8],[7,-32]];
  return [
    {n:'밑줄',col:'#ff8a3d',M:plMulti([plMake(un)]),ox:65,oy:96},
    {n:'화살표',col:'#6fd3ff',M:plMulti([plMake(cv),plMake([bl,e,br])]),ox:68,oy:76},
    {n:'체크 표시',col:'#3ecf8e',M:plMulti([plMake(ci),plMake([[-12,2],[-3,13],[14,-9]])]),ox:150,oy:72},
    {n:'로고 윤곽',col:'#b49cff',M:plMulti([plMake(bolt)]),ox:150,oy:72}
  ];
})();
const SPD89=260;

const demo = {
  dur: 3.4, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    S89.forEach((sh,i)=>{
      const px=14+(i%2)*312,py=18+Math.floor(i/2)*148,len=sh.M.len,D=Math.max(.5,len/SPD89),t0=.4+i*.3;
      rr(c,px,py,300,138,10);c.fillStyle='rgba(255,255,255,.03)';c.fill();c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;c.stroke();
      txt2(c,sh.n,px+12,py+19,13,a?sh.col:'#9ba3ad',700);
      if(i===0)txt2(c,'꼭 기억할 문장',px+150,py+78,22,EN_COL.ink,700,'center');
      const f=a?EZ.inOutQ(seg(t,t0,t0+D)):1,al=a?1:EZ.outQ(seg(t,t0,t0+.3));
      c.save();c.translate(px+sh.ox,py+sh.oy);c.globalAlpha=al;c.strokeStyle=a?sh.col:'#8b94a3';c.lineWidth=3.2;c.lineCap='round';c.lineJoin='round';
      if(i===3&&(f>=1||!a)){c.globalAlpha=al*(a?sstep(0,.3,seg(t,t0+D,t0+D+.5)):1);c.beginPath();sh.M.parts[0].pts.forEach((q,k)=>k?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));const g=c.createLinearGradient(0,-32,0,32);g.addColorStop(0,'rgba(180,156,255,.55)');g.addColorStop(1,'rgba(180,156,255,.12)');c.fillStyle=g;c.fill();c.globalAlpha=al;}
      const tip=plDraw(c,sh.M,f);
      if(a&&f>0&&f<1){ezBall(c,tip[0],tip[1],4.2,'#ff8a3d');c.strokeStyle='rgba(255,138,61,.35)';c.lineWidth=1.2;c.beginPath();c.arc(tip[0],tip[1],8,0,TAU);c.stroke();}
      if(a&&i===2&&t>t0+D&&t<t0+D+.5){const q=(t-t0-D)/.5;c.strokeStyle='rgba(62,207,142,'+.6*(1-q)+')';c.lineWidth=2;c.beginPath();c.arc(0,0,28+14*EZ.outC(q),0,TAU);c.stroke();}
      c.restore();
      txtk(c,a?'길이 '+Math.round(len)+'px · '+D.toFixed(2)+'초 · 속도 '+SPD89+'px/초':'그리는 과정 없음 — 완성본이 페이드로 나타남',px+12,py+132,9.5,a?EN_COL.muted:'#6a7385');
    });
    cap(c,a?'연출 후: 선이 일정한 속도로 그려지며 펜 끝이 보이고, 닫힌 도형은 다 그린 뒤에 면이 채워진다':'연출 전: 완성된 그림이 페이드로 나타남 — 어디서 시작해 어디로 가는지 알 수 없다',16,350);
  }
};
export default demo;
