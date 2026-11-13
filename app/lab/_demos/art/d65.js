// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d65. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, bgFill, cap, glowDot, txt2, txtm, uiReset } from "./shared/common.js";

function cbStar(c,x,y,r,st,t){                              /* st: 0 윤곽만(설정), 1 반쯤(되살림), 2 가득 + 빛(페이오프) */
  const pts=()=>{c.beginPath();for(let i=0;i<8;i++){const rd=i%2?r*.3:r,an=-Math.PI/2+i*Math.PI/4;c.lineTo(x+Math.cos(an)*rd,y+Math.sin(an)*rd);}c.closePath();};
  if(st>=2){c.globalCompositeOperation='lighter';glowDot(c,[255,170,90],x,y,r*3.2,.7+.25*Math.sin(t*6));c.globalCompositeOperation='source-over';c.globalAlpha=1;}
  pts();if(st===0){c.strokeStyle='rgba(255,138,61,.75)';c.lineWidth=1.4;c.stroke();}
  else{const g=c.createLinearGradient(x,y-r,x,y+r);g.addColorStop(0,'#ffd9b0');g.addColorStop(1,'#ff8a3d');c.globalAlpha=st===1?.62:1;c.fillStyle=g;c.fill();c.globalAlpha=1;c.strokeStyle='#ffb27f';c.lineWidth=1.2;c.stroke();}
}
const CB_C=[{x:20,tod:['#2a2f5a','#9a6a8a'],lab:'0:20 · 훅',st:0},{x:225,tod:['#3a6ab0','#a8c8f0'],lab:'3:40 · 중반',st:1},{x:430,tod:['#c85a40','#ffb878'],lab:'7:30 · 마무리',st:2}];
function cbRoom(c,x,y,w,h,tod){
  c.save();rr(c,x,y,w,h,10);c.clip();const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,tod[0]);g.addColorStop(1,tod[1]);c.fillStyle=g;c.fillRect(x,y,w,h);
  c.fillStyle='rgba(10,14,28,.55)';c.fillRect(x,y+h*.62,w,h*.38);rr(c,x+w-70,y+16,52,44,3);c.fillStyle='rgba(255,255,255,.18)';c.fill();c.fillStyle='rgba(0,0,0,.25)';c.fillRect(x+w-45,y+16,2,44);c.fillRect(x+w-70,y+37,52,2);
  c.fillStyle='#3a2a22';c.fillRect(x,y+h*.62,w,3);c.fillStyle='#e8dcc4';rr(c,x+40,y+h*.62-18,22,18,3);c.fill();c.strokeStyle='#e8dcc4';c.lineWidth=2.4;c.beginPath();c.arc(x+64,y+h*.62-9,6,-1.2,1.2);c.stroke();c.restore();
}

const demo = {
  dur: 5.8, rest: 5.2, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const appear=[.3,1.7,3.0],Y=62,W=190,H=140;
    CB_C.forEach((cd,i)=>{
      const u=a?E.outC(seg(t,appear[i],appear[i]+.5)):(t>=.3+i*.3?1:0);if(u<=0)return;
      c.save();c.globalAlpha=u;c.translate(0,(1-u)*18);
      c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=20;c.shadowOffsetY=10;rr(c,cd.x,Y,W,H,10);c.fillStyle='#000';c.fill();c.shadowColor='transparent';c.shadowBlur=0;
      cbRoom(c,cd.x,Y,W,H,cd.tod);
      const mx=cd.x+51,my=Y+H*.62-34;
      if(a){let sc=1,r0=11;if(i===2){sc=E.outBack(seg(t,4.0,4.6));r0=11+16*sc;}cbStar(c,mx,my,r0,cd.st,t);
        if(i===1&&t>appear[1]+.5&&t<appear[1]+1.2){c.strokeStyle='rgba(255,178,127,'+(1-(t-appear[1]-.5)/.7)+')';c.lineWidth=1.5;c.beginPath();c.arc(mx,my,11+22*(t-appear[1]-.5)/.7,0,TAU);c.stroke();}
        if(i===0&&t>.8&&t<1.5){c.strokeStyle='rgba(255,178,127,'+(1-(t-.8)/.7)+')';c.lineWidth=1.5;c.beginPath();c.arc(mx,my,11+22*(t-.8)/.7,0,TAU);c.stroke();}}
      else{ /* 연출 전: 첫 장면에만 별, 나머지는 서로 무관한 모양 */
        if(i===0)cbStar(c,mx,my,11,0,t);else{c.fillStyle='rgba(200,210,230,.8)';c.beginPath();if(i===1)c.arc(mx,my,9,0,TAU);else{c.moveTo(mx,my-11);c.lineTo(mx+10,my+8);c.lineTo(mx-10,my+8);c.closePath();}c.fill();}}
      c.restore();
      txt2(c,cd.lab,cd.x+4,Y+H+22,12,'#dfe5ee',700);
      if(a){const tag=i===0?'SETUP · 깔아 두기':i===1?'REFRESH · 되살리기':'PAYOFF · 터뜨리기',al=E.outC(seg(t,appear[i]+.3,appear[i]+.7)),col=i===2?'#ffb27f':'#9ba3ad';c.globalAlpha=al;txtm(c,tag,cd.x+4,Y+H+38,9.5,col);c.globalAlpha=1;}
    });
    /* 연결선 */
    if(a){[[0,1,2.0,2.7],[1,2,3.3,4.0]].forEach(q=>{const p=E.outC(seg(t,q[2],q[3]));if(p<=0)return;const ax=CB_C[q[0]].x+51,bx=CB_C[q[1]].x+51,ay=Y+H*.62-34,N=Math.floor(40*p);c.strokeStyle='rgba(255,138,61,'+(t>4.2?.95:.6)+')';c.lineWidth=t>4.2?2.2:1.4;c.setLineDash([4,5]);c.beginPath();for(let i=0;i<=N;i++){const u=i/40,x=ax+(bx-ax)*u,y=ay-26*Math.sin(u*Math.PI)*1.4+0;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();c.setLineDash([]);});}
    /* 타임라인 */
    c.fillStyle='#262e3d';c.fillRect(40,300,560,2);const pos=[.04,.46,.94];
    CB_C.forEach((cd,i)=>{const on=a?t>=appear[i]+.3:(i===0&&t>=.3);c.fillStyle=on?'#ff8a3d':'#3a4254';c.beginPath();c.arc(40+560*pos[i],301,on?6:4,0,TAU);c.fill();});
    txtm(c,'예시 8분 영상의 위치',40,292,9,'#5b6577');
    if(a){const pa=E.outC(seg(t,4.3,4.8));c.globalAlpha=pa;rr(c,150,262,340,26,13);c.fillStyle='rgba(255,138,61,.2)';c.fill();c.strokeStyle='#ff8a3d';c.lineWidth=1.2;c.stroke();txt2(c,'처음 장면의 그 별 = 이 영상의 결론',320,280,13.5,'#ffd9b0',700,'center');c.globalAlpha=1;}
    cap(c,a?'0:20에 별을 깔고 → 3:40에 다시 보여 주고 → 7:30에 가장 크게 터뜨림 · 같은 모양이 이어짐':'연출 전: 별은 한 번 나오고 끝 → 나머지 장면의 모양은 서로 무관(연결 없음)',16,350);
  }
};
export default demo;
