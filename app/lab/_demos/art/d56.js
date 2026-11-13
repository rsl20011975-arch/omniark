// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d56. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, TY_DISP, UI_SANS, cap, clipArt, sstep, txt2, txtm, uiReset, vn } from "./shared/common.js";

const MT_W=320,MT_H=180,MT_L=(()=>{const L=new Float32Array(MT_W*MT_H);let mn=9,mx=-9;for(let y=0;y<MT_H;y++)for(let x=0;x<MT_W;x++){const n=vn(x*.035,y*.035)*.7+vn(x*.09+7,y*.09)*.3,v=.55*(x/MT_W)+.3*(1-y/MT_H)+.15*n;L[y*MT_W+x]=v;if(v<mn)mn=v;if(v>mx)mx=v;}for(let i=0;i<L.length;i++)L[i]=(L[i]-mn)/(mx-mn);return L;})();
function mtPoster(c){
  c.setTransform(2,0,0,2,0,0);const g=c.createLinearGradient(0,0,640,360);g.addColorStop(0,'#ff9c58');g.addColorStop(1,'#d94a8c');c.fillStyle=g;c.fillRect(0,0,640,360);
  c.fillStyle='rgba(255,255,255,.2)';c.beginPath();c.arc(500,100,120,0,TAU);c.fill();c.beginPath();c.arc(120,320,150,0,TAU);c.fill();
  c.font='400 84px '+TY_DISP;c.fillStyle='#fff8ea';c.textAlign='center';c.textBaseline='alphabetic';c.fillText('다음 장면',320,206);c.font='600 16px '+UI_SANS;c.fillStyle='rgba(255,248,234,.9)';c.fillText('루마 매트가 밝기대로 지워지며 나타남',320,246);
}

const demo = {
  dur: 5.8, rest: 4.2, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0d16';const mk=(w,h)=>{const o=document.createElement('canvas');o.width=w;o.height=h;return o;};
    const mc=mk(MT_W,MT_H),lg=mk(MT_W,MT_H),lx=lg.getContext('2d'),li=lx.createImageData(MT_W,MT_H);for(let i=0;i<MT_L.length;i++){const v=MT_L[i]*255;li.data[i*4]=li.data[i*4+1]=li.data[i*4+2]=v;li.data[i*4+3]=255;}lx.putImageData(li,0,0);
    return {ctx:canvas(sp),tm:mk(1280,720),tmp:mk(1280,720),mc,mimg:mc.getContext('2d').createImageData(MT_W,MT_H),lg};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    const font='400 128px '+TY_DISP,k=a?sstep(1.5,2.0,t):0;
    c.fillStyle='#0a0d16';c.fillRect(0,0,640,360);
    if(a&&t>1.2){c.globalAlpha=.16*sstep(1.2,1.7,t);clipArt(c,0,0,640,360,0,t);c.globalAlpha=1;c.fillStyle='rgba(8,10,18,.55)';c.fillRect(0,0,640,360);}
    c.font=font;c.textAlign='center';c.textBaseline='alphabetic';
    if(k<1){c.globalAlpha=1-k;c.fillStyle='#f4efe4';c.fillText('MOTION',320,212);c.globalAlpha=1;}
    if(k>0){const sc=s.tmp.getContext('2d');sc.setTransform(2,0,0,2,0,0);sc.globalCompositeOperation='source-over';sc.clearRect(0,0,640,360);clipArt(sc,0,0,640,360,0,t*1.2);
      const x=s.tm.getContext('2d');x.setTransform(2,0,0,2,0,0);x.globalCompositeOperation='source-over';x.clearRect(0,0,640,360);x.font=font;x.textAlign='center';x.textBaseline='alphabetic';x.fillStyle='#fff';x.fillText('MOTION',320,212);
      x.globalCompositeOperation='source-in';x.save();x.setTransform(1,0,0,1,0,0);x.drawImage(s.tmp,0,0);x.restore();x.globalCompositeOperation='source-over';
      c.save();c.globalAlpha=k;c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=22;c.shadowOffsetY=8;c.drawImage(s.tm,0,0,640,360);c.restore();c.globalAlpha=k*.5;c.font=font;c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1;c.strokeText('MOTION',320,212);c.globalAlpha=1;}
    const nm=['① 글자 · 일반 도형','② 글자 모양이 창이 됨 — 알파 매트','③ 밝기 지도로 지워지며 전환 — 루마 매트'],ph=t<1.5?0:(t<3.5?1:2);
    rr(c,14,14,300,22,11);c.fillStyle='rgba(0,0,0,.65)';c.fill();txt2(c,nm[a?ph:0],26,29,11.5,'#f4efe4',700);
    if(k>.3){c.globalAlpha=sstep(.3,1,k)*(1-sstep(3.4,3.6,t));txt2(c,'글자(위 층)의 모양대로 영상(아래 층)이 보임',320,262,14,'#9ba3ad',600,'center');c.globalAlpha=1;}
    const p=a?-.07+1.14*E.inOutC(seg(t,3.5,4.9)):(t>=3.5?2:-1);
    if(!a&&t>=3.5){mtPoster(s.tmp.getContext('2d'));c.drawImage(s.tmp,0,0,640,360);}
    if(a&&p>-.07){const md=s.mimg.data;for(let i=0;i<MT_L.length;i++){md[i*4]=md[i*4+1]=md[i*4+2]=255;md[i*4+3]=255*(1-sstep(p-.1,p+.1,MT_L[i]));}
      s.mc.getContext('2d').putImageData(s.mimg,0,0);const x=s.tmp.getContext('2d');x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='source-over';x.clearRect(0,0,1280,720);mtPoster(x);x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='destination-in';x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(s.mc,0,0,1280,720);x.globalCompositeOperation='source-over';c.drawImage(s.tmp,0,0,640,360);}
    if(a){const ta=sstep(3.2,3.5,t)*(1-sstep(5.0,5.4,t));if(ta>0){c.globalAlpha=ta;[[s.lg,'LUMA(밝기 지도)',500],[s.mc,'매트(현재 문턱)',556]].forEach((q,i)=>{const xx=i?560:456;c.strokeStyle='#fff';c.lineWidth=1;c.drawImage(q[0],xx,296,92,52);c.strokeRect(xx+.5,296.5,92,52);txtm(c,i?'MATTE':'LUMA',xx+46,292,8.5,'#dfe5ee','center');});c.globalAlpha=1;}}
    cap(c,a?'글자 = 매트(모양) · 영상 = 내용 · 밝기 지도의 문턱이 올라가며 장면이 넘어감':'연출 전: 일반 글자 → 장면이 컷으로 바뀜(매트도, 부드러운 전환도 없음)',16,350);
  }
};
export default demo;
