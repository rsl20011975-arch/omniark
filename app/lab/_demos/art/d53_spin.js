// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d53. 직접 고치지 않는다 — 응용 팁 'spin' 적용본
/* eslint-disable */
// @ts-nocheck

import { rng, canvas } from "./helpers.js";
import { TAU, TY_DISP, bgFill, cap, glowDot, txtm, uiReset } from "./shared/common.js";

function mtDisc(c,cx,cy,R,th){
  const cg=c.createConicGradient?c.createConicGradient(th,cx,cy):null;
  if(cg){[[0,'#eef2f6'],[.07,'#6a727e'],[.15,'#cbd2da'],[.24,'#343a44'],[.32,'#aeb6c1'],[.41,'#f2f5f8'],[.5,'#5c6472'],[.58,'#d6dce4'],[.67,'#2e343e'],[.75,'#b6bec8'],[.83,'#f6f9fb'],[.92,'#6b737f'],[1,'#eef2f6']].forEach(q=>cg.addColorStop(q[0],q[1]));c.fillStyle=cg;}else c.fillStyle='#9aa3ae';
  c.save();c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=26;c.shadowOffsetY=14;c.beginPath();c.arc(cx,cy,R,0,TAU);c.fill();c.restore();
  c.save();c.beginPath();c.arc(cx,cy,R,0,TAU);c.clip();const r=rng(3);
  for(let i=0;i<240;i++){const rad=r()*R,an=r()*TAU,len=.3+r()*.9;c.strokeStyle=r()<.5?'rgba(255,255,255,'+(.04+r()*.08)+')':'rgba(0,0,0,'+(.04+r()*.08)+')';c.lineWidth=.6;c.beginPath();c.arc(cx,cy,rad,an,an+len);c.stroke();}c.restore();
  const lx=Math.cos(th-.8),ly=Math.sin(th-.8),rim=c.createLinearGradient(cx-lx*R,cy-ly*R,cx+lx*R,cy+ly*R);rim.addColorStop(0,'rgba(255,255,255,.9)');rim.addColorStop(.5,'rgba(255,255,255,0)');rim.addColorStop(1,'rgba(0,0,0,.55)');
  c.strokeStyle=rim;c.lineWidth=7;c.beginPath();c.arc(cx,cy,R-3.5,0,TAU);c.stroke();
  c.save();c.beginPath();c.arc(cx,cy,R*.62,0,TAU);c.clip();const dg=c.createLinearGradient(cx+lx*R*.6,cy+ly*R*.6,cx-lx*R*.6,cy-ly*R*.6);dg.addColorStop(0,'rgba(0,0,0,.38)');dg.addColorStop(1,'rgba(255,255,255,.3)');c.fillStyle=dg;c.fillRect(cx-R,cy-R,R*2,R*2);c.restore();
  c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=1.4;c.beginPath();c.arc(cx,cy,R*.62,0,TAU);c.stroke();c.strokeStyle='rgba(255,255,255,.45)';c.beginPath();c.arc(cx,cy,R*.62+1.6,0,TAU);c.stroke();
  const star=(ox,oy)=>{c.beginPath();for(let i=0;i<10;i++){const rd=i%2?R*.17:R*.4,an=-Math.PI/2+i*Math.PI/5;c.lineTo(cx+ox+Math.cos(an)*rd,cy+oy+Math.sin(an)*rd);}c.closePath();};
  star(lx*1.6,ly*1.6);c.fillStyle='rgba(255,255,255,.55)';c.fill();star(-lx*1.4,-ly*1.4);c.fillStyle='rgba(0,0,0,.45)';c.fill();star(0,0);const sg=c.createLinearGradient(cx-lx*R*.4,cy-ly*R*.4,cx+lx*R*.4,cy+ly*R*.4);sg.addColorStop(0,'#c9d0d8');sg.addColorStop(1,'#5c6472');c.fillStyle=sg;c.fill();
}

const demo = {
  dur: 5, rest: 1.8, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0c12';return {ctx:canvas(sp),tx:(()=>{const o=document.createElement('canvas');o.width=640;o.height=260;return o;})()};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#12161f','#07080c');
    const th=a?t*2:.4,cx=170,cy=176,R=96;
    const fl=c.createLinearGradient(0,300,0,360);fl.addColorStop(0,'rgba(255,255,255,.05)');fl.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=fl;c.fillRect(0,300,640,60);
    if(!a){c.fillStyle='#8a929c';c.beginPath();c.arc(cx,cy,R,0,TAU);c.fill();c.fillStyle='#6a727c';c.beginPath();c.arc(cx,cy,R*.62,0,TAU);c.fill();
      c.fillStyle='#8a929c';c.font='400 74px '+TY_DISP;c.textAlign='center';c.fillText('METAL',470,206);
      cap(c,'연출 전: 회색 한 가지로 채움 → 금속인지 플라스틱인지 알 수 없고 빛도 없음',16,350);return;}
    mtDisc(c,cx,cy,R,th);
    /* 크롬 글자: 수평선 그라디언트 + 지나가는 빛 줄기 */
    const tx=s.tx.getContext('2d');tx.setTransform(2,0,0,2,0,0);tx.clearRect(0,0,640,260);tx.font='400 74px '+TY_DISP;tx.textAlign='center';tx.textBaseline='alphabetic';
    const hz=.5+.05*Math.sin(th),g=tx.createLinearGradient(0,40,0,130);[[0,'#ffffff'],[.24,'#aab8c8'],[hz-.02,'#394557'],[hz,'#0d1118'],[hz+.03,'#6f8196'],[.78,'#d8e2ee'],[1,'#ffffff']].forEach(q=>g.addColorStop(Math.max(0,Math.min(1,q[0])),q[1]));
    tx.lineJoin='round';tx.strokeStyle='#05070b';tx.lineWidth=7;tx.strokeText('METAL',150,100);tx.fillStyle=g;tx.fillText('METAL',150,100);
    const sx=30+(.5+.5*Math.sin(th*1.2))*240,sw=tx.createLinearGradient(sx-34,0,sx+34,0);sw.addColorStop(0,'rgba(255,255,255,0)');sw.addColorStop(.5,'rgba(255,255,255,.75)');sw.addColorStop(1,'rgba(255,255,255,0)');
    tx.globalCompositeOperation='source-atop';tx.fillStyle=sw;tx.fillRect(sx-34,30,68,90);tx.globalCompositeOperation='source-over';
    c.save();c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=18;c.shadowOffsetY=10;c.drawImage(s.tx,0,0,640,260,320,106,320,130);c.restore();
    c.save();c.translate(0,416);c.scale(1,-1);c.globalAlpha=.16;c.drawImage(s.tx,0,0,640,260,320,106,320,130);c.restore();c.globalAlpha=1;
    /* 빛의 방향 표시 */
    const ox=560,oy=70,orb=26;c.strokeStyle='#262e3d';c.lineWidth=1;c.beginPath();c.arc(ox,oy,orb,0,TAU);c.stroke();
    const lx=ox+Math.cos(th-.8)*orb*-1,ly=oy+Math.sin(th-.8)*orb*-1;c.fillStyle='#ffd985';c.beginPath();c.arc(lx,ly,5,0,TAU);c.fill();c.globalCompositeOperation='lighter';glowDot(c,[255,220,140],lx,ly,16,.6);c.globalCompositeOperation='source-over';c.globalAlpha=1;
    txtm(c,'LIGHT',ox,oy+orb+16,9,'#8b94a3','center');
    txtm(c,'conic gradient + 동심 브러시 선',cx,cy+R+30,9.5,'#8b94a3','center');txtm(c,'수평선 gradient + 빛 줄기',470,282,9.5,'#8b94a3','center');
    cap(c,'빛이 돌면 하이라이트·테두리 경사·크롬 반사가 함께 따라 돎',16,350);
  }
};
export default demo;
