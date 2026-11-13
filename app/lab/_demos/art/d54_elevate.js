// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d54. 직접 고치지 않는다 — 응용 팁 'elevate' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas } from "./helpers.js";
import { TAU, TY_DISP, cap, txtm, tyDraw, tyLay, uiReset } from "./shared/common.js";

const PP_COL=['#d3dffd','#a2bcee','#7498d8','#4d76ba','#305592'];
function ppPts(i,off){const base=150+i*38,A1=14+i*3,f1=.011+i*.003,ph=i*1.9,P=[];for(let x=-10;x<=650;x+=8)P.push([x,base+off+A1*Math.sin(x*f1+ph)+7*Math.sin(x*f1*2.3+ph*1.4)]);return P;}

const demo = {
  dur: 5.2, rest: 3.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#e9efff';const nz=document.createElement('canvas');nz.width=96;nz.height=96;const nx=nz.getContext('2d'),img=nx.createImageData(96,96),r=rng(21);for(let i=0;i<96*96;i++){const v=110+r()*145;img.data[i*4]=img.data[i*4+1]=img.data[i*4+2]=v;img.data[i*4+3]=255;}nx.putImageData(img,0,0);return {ctx:canvas(sp),nz};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);
    const bg=c.createLinearGradient(0,0,0,360);bg.addColorStop(0,'#f1f4ff');bg.addColorStop(1,'#dfe7fb');c.fillStyle=bg;c.fillRect(0,0,640,360);
    const sp=a?E.outBack(seg(t,.2,.8)):1;
    c.save();if(a){c.shadowColor='rgba(40,60,120,.35)';c.shadowBlur=12;c.shadowOffsetY=5;}c.fillStyle='#ffd9a0';c.beginPath();c.arc(520,92,34*Math.max(0,sp),0,TAU);c.fill();c.restore();
    const pat=a?c.createPattern(s.nz,'repeat'):null;
    for(let i=0;i<5;i++){
      const u=a?E.outBack(seg(t,.3+.18*i,.95+.18*i)):1,off=(1-u)*120,sw=a?Math.sin(t*.7+i*1.3)*(2+i*2.2):0,P=ppPts(i,off);
      c.save();c.translate(sw,0);
      if(a){c.shadowColor='rgba(24,36,84,.75)';c.shadowBlur=8+i*8;c.shadowOffsetY=-(3+i*6);}
      c.beginPath();c.moveTo(P[0][0],380);P.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(P[P.length-1][0],380);c.closePath();c.fillStyle=PP_COL[i];c.fill();c.shadowColor='transparent';c.shadowBlur=0;
      if(a){c.save();c.clip();c.globalCompositeOperation='multiply';c.globalAlpha=.17;c.fillStyle=pat;c.fillRect(-10,0,660,380);c.restore();
        c.beginPath();P.forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.3;c.stroke();}
      c.restore();
    }
    const L=tyLay(c,'PAPER','400 70px '+TY_DISP,320,6);
    L.forEach((o,i)=>{const u=a?E.outBack(seg(t,1.7+i*.12,2.3+i*.12)):1;if(u<=.002)return;const cx=o.x+o.w/2,rot=(i%2?.05:-.06);c.save();c.translate(cx,128-(1-u)*70);c.rotate(rot*u);c.translate(-cx,-128);
      if(a){c.shadowColor='rgba(24,36,84,.4)';c.shadowBlur=8;c.shadowOffsetY=5;}tyDraw(c,o.ch,o.x,128,'400 70px '+TY_DISP,'#fff8ea');c.restore();});
    if(a)txtm(c,'ELEVATION  blur 8→40px · offset 3→27px',16,24,9.5,'#5b6a8c');
    cap(c,a?'층이 차례로 올라옴 · 층마다 그림자 크기가 다름 · 종이 결 · 윗선 빛':'연출 전: 색 면만 겹침 → 그림자·결이 없어 종이가 아니라 평면 도형',16,350);
  }
};
export default demo;
