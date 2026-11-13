// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d45. 직접 고치지 않는다 — 응용 팁 'morefar' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas, rr } from "./helpers.js";
import { TAU, bgFill, cap, txt2, txtm, uiReset } from "./shared/common.js";

const WN={W:1500,H:500,PW:304,PH:150};
function wMk(draw){const cv=document.createElement('canvas');cv.width=WN.W;cv.height=WN.H;draw(cv.getContext('2d'));return cv;}
function wLayers(){
  const sky=wMk(x=>{const g=x.createLinearGradient(0,0,0,500);g.addColorStop(0,'#070b22');g.addColorStop(.55,'#2a2150');g.addColorStop(.88,'#7a4256');g.addColorStop(1,'#1a1018');x.fillStyle=g;x.fillRect(0,0,1500,500);
    const r=rng(2);x.fillStyle='#fff';for(let i=0;i<130;i++){x.globalAlpha=.25+r()*.6;x.fillRect(r()*1500,r()*300,1.4,1.4);}x.globalAlpha=1;
    const mg=x.createRadialGradient(900,110,4,900,110,70);mg.addColorStop(0,'rgba(255,244,214,.95)');mg.addColorStop(.35,'rgba(255,230,180,.25)');mg.addColorStop(1,'rgba(255,230,180,0)');x.fillStyle=mg;x.fillRect(800,10,200,200);x.fillStyle='#fff3d6';x.beginPath();x.arc(900,110,26,0,TAU);x.fill();});
  const bld=(col,wmin,wmax,hmin,hmax,seed,win)=>wMk(x=>{const r=rng(seed);let px=-10;while(px<1500){const w=wmin+r()*(wmax-wmin),h=hmin+r()*(hmax-hmin);x.fillStyle=col;x.fillRect(px,450-h,w,h);
    for(let wy=450-h+10;wy<440;wy+=13)for(let wx=px+6;wx<px+w-8;wx+=11)if(r()<win){x.fillStyle='rgba(255,213,138,'+(.35+r()*.5)+')';x.fillRect(wx,wy,4,6);}px+=w+r()*14;}x.fillStyle=col;x.fillRect(0,450,1500,50);});
  const far=bld('#121835',40,90,100,260,4,.12),mid=bld('#1a2347',60,120,120,340,9,.2);
  const near=wMk(x=>{x.fillStyle='#090c16';x.fillRect(0,440,1500,60);x.fillStyle='#161b2a';x.fillRect(0,438,1500,3);x.fillStyle='rgba(255,255,255,.25)';for(let dx=20;dx<1500;dx+=90)x.fillRect(dx,470,46,3);
    for(let px=110;px<1500;px+=290){x.fillStyle='#05060c';x.fillRect(px,230,6,212);x.fillRect(px-26,226,32,5);const lg=x.createRadialGradient(px-24,236,2,px-24,236,70);lg.addColorStop(0,'rgba(255,214,140,.9)');lg.addColorStop(1,'rgba(255,214,140,0)');x.fillStyle=lg;x.fillRect(px-100,170,150,140);x.fillStyle='#ffe6b0';x.beginPath();x.arc(px-22,234,4,0,TAU);x.fill();}
    const r=rng(7);for(let px=40;px<1500;px+=330){x.fillStyle='#070a12';x.beginPath();x.ellipse(px,414,20+r()*8,26+r()*10,0,0,TAU);x.fill();x.fillRect(px-3,420,6,22);}});
  return {sky,far,mid,near};
}
function wCar(c,x,y){c.save();c.translate(x,y);c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.ellipse(0,2,36,5,0,0,TAU);c.fill();
  const g=c.createLinearGradient(0,-26,0,0);g.addColorStop(0,'#ffb27f');g.addColorStop(1,'#d9601c');c.fillStyle=g;rr(c,-32,-19,64,15,5);c.fill();rr(c,-18,-28,34,13,5);c.fill();
  c.fillStyle='rgba(20,28,48,.85)';rr(c,-14,-26,12,9,2);c.fill();rr(c,0,-26,12,9,2);c.fill();c.fillStyle='#10131c';[-20,20].forEach(wx=>{c.beginPath();c.arc(wx,-4,6,0,TAU);c.fill();});
  c.fillStyle='#ffe9a8';c.fillRect(30,-15,3,4);const hg=c.createRadialGradient(36,-13,1,36,-13,26);hg.addColorStop(0,'rgba(255,233,168,.55)');hg.addColorStop(1,'rgba(255,233,168,0)');c.fillStyle=hg;c.fillRect(30,-34,60,42);c.restore();}
const WP=[{x:12,y:20,k:'pan',t:'① 팬',s:'제자리 회전 · 모든 층이 같이 밀림'},{x:324,y:20,k:'tilt',t:'② 틸트',s:'제자리 위아래 회전 · 모든 층이 같이'},{x:12,y:186,k:'truck',t:'③ 트래킹(트럭)',s:'옆으로 이동 · 가까운 층이 더 빨리'},{x:324,y:186,k:'crane',t:'④ 크레인',s:'위로 이동 · 가까운 층이 더 빨리'}];

const demo = {
  dur: 4.4, rest: 3, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp),L:wLayers()};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const u=E.inOutC(seg(t,.6,3.4)),L=s.L,PW=WN.PW,PH=WN.PH;
    WP.forEach(P=>{
      const mov=P.k==='pan'||P.k==='truck',vert=P.k==='tilt'||P.k==='crane',carX=mov?260+760*u:620,camX=mov?carX-152:470,camX0=mov?108:470,yy=vert?300-240*u:300;
      const fx=P.k==='truck'&&a?{sky:.02,far:.1,mid:.35,near:1}:{sky:1,far:1,mid:1,near:1},fy=P.k==='crane'&&a?{sky:.15,far:.35,mid:.6,near:1}:{sky:1,far:1,mid:1,near:1};
      c.save();rr(c,P.x,P.y,PW,PH,9);c.clip();c.fillStyle='#05060c';c.fillRect(P.x,P.y,PW,PH);
      let nx=0,ny=0;
      ['sky','far','mid','near'].forEach(k=>{
        let sx=camX*fx[k]+(1-fx[k])*camX0,sy=yy*fy[k]+(1-fy[k])*300;sx=Math.max(0,Math.min(WN.W-PW,sx));sy=Math.max(0,Math.min(WN.H-PH,sy));
        c.drawImage(L[k],sx,sy,PW,PH,P.x,P.y,PW,PH);if(k==='near'){nx=sx;ny=sy;}});
      wCar(c,P.x+(carX-nx),P.y+(440-ny));
      const vg=c.createLinearGradient(0,P.y,0,P.y+PH);vg.addColorStop(0,'rgba(0,0,0,.55)');vg.addColorStop(.3,'rgba(0,0,0,0)');c.fillStyle=vg;c.fillRect(P.x,P.y,PW,PH);
      c.restore();rr(c,P.x,P.y,PW,PH,9);c.strokeStyle='#262e3d';c.lineWidth=1;c.stroke();
      txt2(c,P.t,P.x+10,P.y+17,12,'#f4efe4',700);txt2(c,P.s,P.x+10,P.y+PH-9,9.5,'#c9d1de',500);
      const par=a&&(P.k==='truck'||P.k==='crane');txtm(c,par?'PARALLAX ON':'FLAT SHIFT',P.x+PW-8,P.y+17,8.5,par?'#6fd3ff':'#8b94a3','right');
    });
    cap(c,a?'팬·틸트는 평면이 같이 밀림 · 트래킹·크레인은 가까운 층이 더 빨리(시차)':'연출 전: 네 이동을 모두 같은 평행 이동으로 처리 → 구분이 안 됨',16,352);
  }
};
export default demo;
