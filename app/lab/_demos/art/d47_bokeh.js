// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d47. 직접 고치지 않는다 — 응용 팁 'bokeh' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas, rr } from "./helpers.js";
import { TAU, TY_DISP, UI_MONO, cap, fuBr, txtm, uiReset } from "./shared/common.js";

const RF_LG=Array.from({length:38},(_,i)=>{const r=rng(40+i);return {x:14+r()*612,y:34+r()*210,c:[[255,196,120],[255,150,90],[130,200,255],[255,230,190],[200,160,255]][Math.floor(r()*5)],s:.6+r()*.7};});
const RF_T=[[190,96,260,120],[225,74,190,232],[8,126,120,210]],RF_D=[8,1.2,.4];
function rfBuild(c1,c2,c3){
  for(const [cv,fn] of [[c1,0],[c2,1],[c3,2]]){const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,640,360);
    if(fn===0){const g=c.createLinearGradient(0,0,0,360);g.addColorStop(0,'#1b1238');g.addColorStop(.7,'#2b1d44');g.addColorStop(1,'#0c0f1e');c.fillStyle=g;c.fillRect(0,0,640,360);
      const mg=c.createRadialGradient(520,70,2,520,70,90);mg.addColorStop(0,'rgba(255,240,210,.95)');mg.addColorStop(.25,'rgba(255,220,170,.3)');mg.addColorStop(1,'rgba(255,220,170,0)');c.fillStyle=mg;c.fillRect(400,0,240,170);
      const r=rng(77);let x=-10;while(x<650){const w=24+r()*46,h=50+r()*120;c.fillStyle='#0e1226';c.fillRect(x,300-h,w,h+60);for(let wy=300-h+8;wy<300;wy+=10)for(let wx=x+5;wx<x+w-6;wx+=8)if(r()<.25){c.fillStyle='rgba(255,204,130,.55)';c.fillRect(wx,wy,3,4);}x+=w+r()*6;}}
    if(fn===1){c.save();c.translate(320,190);c.rotate(-.05);c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=28;c.shadowOffsetY=12;rr(c,-95,-116,190,232,8);c.fillStyle='#efe7d4';c.fill();c.restore();
      c.save();c.translate(320,190);c.rotate(-.05);rr(c,-83,-104,166,150,4);const pg=c.createLinearGradient(0,-104,0,46);pg.addColorStop(0,'#2b1d5a');pg.addColorStop(.55,'#d0605a');pg.addColorStop(1,'#ffb066');c.fillStyle=pg;c.fill();c.save();rr(c,-83,-104,166,150,4);c.clip();
      c.fillStyle='#ffe6b0';c.beginPath();c.arc(20,-8,26,0,TAU);c.fill();c.fillStyle='#4a2540';c.beginPath();c.moveTo(-83,46);c.lineTo(-40,-20);c.lineTo(0,20);c.lineTo(40,-30);c.lineTo(83,30);c.lineTo(83,46);c.fill();c.restore();
      c.font='400 42px '+TY_DISP;c.fillStyle='#1a1308';c.textAlign='center';c.textBaseline='alphabetic';c.fillText('FOCUS',0,92);c.font='500 10px '+UI_MONO;c.fillStyle='#8a7a5a';c.fillText('f/1.4 · 85mm',0,108);c.restore();}
    if(fn===2){const r=rng(5);[[40,170,1],[60,260,1],[20,320,1],[90,200,.8],[590,300,1],[620,240,1],[560,350,.9],[110,330,.8]].forEach(l=>{for(let k=0;k<3;k++){c.save();c.translate(l[0]+k*18,l[1]-k*26);c.rotate(-.7+r()*1.4);const g=c.createLinearGradient(0,-60,0,60);g.addColorStop(0,'#2a7a62');g.addColorStop(1,'#0c2a2a');c.fillStyle=g;c.beginPath();c.ellipse(0,0,24*l[2],64*l[2],0,0,TAU);c.fill();c.strokeStyle='rgba(180,255,220,.25)';c.lineWidth=1.4;c.beginPath();c.moveTo(0,-56*l[2]);c.lineTo(0,56*l[2]);c.stroke();c.restore();}});}
  }
}
function rfBlur(c,src,tm,b,al){
  const r=b*16;
  if(r<.8){c.globalAlpha=al;c.drawImage(src,0,0,640,360);c.globalAlpha=1;return;}
  const lv=Math.min(4,Math.log2(1+r*.55)),l0=Math.floor(lv),fr=lv-l0,top=Math.min(4,l0+1);
  let cur=src;for(let l=1;l<=top;l++){const t2=tm[l-1],x=t2.getContext('2d');x.globalCompositeOperation='copy';x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(cur,0,0,t2.width,t2.height);cur=t2;}
  const lvImg=l=>l===0?src:tm[l-1];
  c.globalAlpha=al;c.drawImage(lvImg(l0),0,0,640,360);if(fr>.02&&top>l0){c.globalAlpha=al*fr;c.drawImage(lvImg(top),0,0,640,360);}c.globalAlpha=1;
}

const demo = {
  dur: 5, rest: 2.4, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0d1a';const mk=(w,h)=>{const o=document.createElement('canvas');o.width=w;o.height=h;return o;};
    return {ctx:canvas(sp),L:[mk(1280,720),mk(1280,720),mk(1280,720)],tm:[mk(320,180),mk(160,90),mk(80,45),mk(40,23)],ok:false,fontOk:false};},
  render(s,t,a){
    const fOk=!!(document.fonts&&document.fonts.check('120px "Black Han Sans"'));
    if(!s.ok||(fOk&&!s.fontOk)){rfBuild(s.L[0],s.L[1],s.L[2]);s.ok=true;s.fontOk=fOk;}
    const c=s.ctx;uiReset(c);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    const p=a?(t<.7?0:t<1.8?E.inOutC(seg(t,.7,1.8)):t<3.1?1:1+E.inOutC(seg(t,3.1,4.0))):1;
    const b=[Math.abs(p-0),Math.abs(p-1),Math.abs(p-2)].map(v=>a?Math.min(2,v):0);
    c.fillStyle='#08090f';c.fillRect(0,0,640,360);
    rfBlur(c,s.L[0],s.tm,b[0],1);
    /* 배경 불빛: 초점이 맞으면 점, 안 맞으면 커다란 원(보케) */
    c.globalCompositeOperation='lighter';
    RF_LG.forEach(l=>{const rad=1.5*l.s+20*b[0]*l.s,al=a?.9/(1+Math.pow(b[0]*2.4,2))+.07*b[0]:.9;
      c.globalAlpha=Math.min(1,al*(.55+.45*l.s));c.fillStyle='rgb('+l.c+')';c.beginPath();c.arc(l.x,l.y,rad,0,TAU);c.fill();
      if(b[0]>.25){c.globalAlpha=Math.min(.5,.3*b[0]);c.strokeStyle='rgb('+l.c+')';c.lineWidth=1;c.beginPath();c.arc(l.x,l.y,rad,0,TAU);c.stroke();}});
    c.globalCompositeOperation='source-over';c.globalAlpha=1;
    rfBlur(c,s.L[1],s.tm,b[1],1);rfBlur(c,s.L[2],s.tm,b[2],1);
    const vg=c.createRadialGradient(320,180,150,320,180,420);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.5)');c.fillStyle=vg;c.fillRect(0,0,640,360);
    if(a){const k=Math.min(1,p)<1?p:1,i0=p<1?0:1,q=p<1?p:p-1,R=RF_T[i0].map((v,i)=>v+(RF_T[i0+1][i]-v)*q),dist=p<1?RF_D[0]+(RF_D[1]-RF_D[0])*p:RF_D[1]+(RF_D[2]-RF_D[1])*(p-1);
      c.strokeStyle='rgba(255,255,255,.9)';fuBr(c,R[0],R[1],R[2],R[3],1,'rgba(255,255,255,.9)');c.fillStyle='rgba(255,255,255,.9)';c.fillRect(R[0]+R[2]/2-4,R[1]+R[3]/2-.5,8,1);c.fillRect(R[0]+R[2]/2-.5,R[1]+R[3]/2-4,1,8);
      txtm(c,'AF  '+dist.toFixed(1)+' m',R[0],R[1]-6,10,'rgba(255,255,255,.9)');}
    txtm(c,'f/1.4',590,26,10,'rgba(255,255,255,.75)','right');txtm(c,'● REC',590,40,9,'#ff5f57','right');
    cap(c,a?'초점이 배경 → 인물 → 앞 잎사귀로 이동 · 초점 밖은 흐리고 불빛은 보케로':'연출 전: 모든 층이 똑같이 또렷함 → 평평하고 시선이 갈 곳이 없음',16,350);
  }
};
export default demo;
