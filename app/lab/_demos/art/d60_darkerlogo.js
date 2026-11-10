// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d60. 직접 고치지 않는다 — 응용 팁 'darkerlogo' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, bgLogo, cap, clipArt, sstep, txt2, txtm, uiReset } from "./shared/common.js";

const demo = {
  dur: 6.6, rest: 2, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0c18';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);c.imageSmoothingEnabled=true;
    clipArt(c,0,0,640,360,1,t);const bs=c.createLinearGradient(0,200,0,360);bs.addColorStop(0,'rgba(0,0,0,0)');bs.addColorStop(1,'rgba(0,0,0,.5)');c.fillStyle=bs;c.fillRect(0,200,640,160);
    /* 안전 영역(제목 안전 90%) */
    const ga=a?1-sstep(.7,1.1,t):0;if(ga>0){c.save();c.globalAlpha=ga*.8;c.setLineDash([4,4]);c.strokeStyle='#ffd985';c.lineWidth=1;c.strokeRect(32,18,576,324);c.setLineDash([]);txtm(c,'TITLE SAFE 90%',36,32,9,'#ffd985');c.restore();}
    /* 워터마크 */
    const wa=a?sstep(.3,.7,t)*.7:.7,sting=a&&t>=4.9&&t<6.6;
    if(!sting){bgLogo(c,596,30,9,wa,2);txtm(c,'OMNIARK',582,34,9,'rgba(255,255,255,'+wa+')','right');}
    /* 로어서드 */
    const lin=a?E.outC(seg(t,.8,1.2)):(t>=.8?1:0),bgp=a?E.outC(seg(t,.9,1.4)):lin,nm=a?E.outC(seg(t,1.1,1.5)):lin,rl=a?E.outC(seg(t,1.3,1.7)):lin,out=a?E.inC(seg(t,2.5,3.0)):(t>=3.0?1:0),ox=-340*out;
    if(lin>0&&out<1){c.save();c.translate(ox,0);const x0=40,y0=262,W=300;
      c.fillStyle='rgba(8,12,20,.86)';c.fillRect(x0,y0,W*bgp,54);c.fillStyle='#ff8a3d';c.fillRect(x0,y0,W*lin,3);c.fillRect(x0,y0,5,54*bgp);
      c.save();c.beginPath();c.rect(x0+16,y0+8,W-20,22);c.clip();txt2(c,'김드림',x0+16,y0+27+(a?(1-nm)*24:0),20,'#f4efe4',700);c.restore();
      c.save();c.beginPath();c.rect(x0+16,y0+32,W-20,18);c.clip();txt2(c,'1인 기업 운영자 · 영상 연출',x0+16,y0+46+(a?(1-rl)*20:0),11.5,'#ffb27f',600);c.restore();c.restore();}
    /* 챕터 카드 */
    const ci=a?E.inOutC(seg(t,3.2,3.7)):(t>=3.2?1:0),co=a?E.inOutC(seg(t,4.2,4.7)):(t>=4.7?1:0);
    if(ci>0&&co<1){const xr=700*ci,xl=700*co;c.save();c.beginPath();c.moveTo(xl,0);c.lineTo(xr,0);c.lineTo(xr-80,360);c.lineTo(xl-80,360);c.closePath();c.clip();c.fillStyle='#10141c';c.fillRect(0,0,640,360);
      const cp=a?E.outC(seg(t,3.55,4.0)):1;c.globalAlpha=cp;txt2(c,'02',64,222+(a?(1-cp)*20:0),120,'#ff8a3d',700);txt2(c,'원리를 배우기',230,178+(a?(1-cp)*14:0),36,'#f4efe4',700);txt2(c,'장면의 구조를 이해하는 단계',232,208,14,'#9ba3ad',500);
      for(let i=0;i<6;i++){c.fillStyle=i<2?'#ff8a3d':'#262e3d';c.fillRect(232+i*30,236,24,4);}c.globalAlpha=1;
      c.fillStyle='#ff8a3d';c.beginPath();c.moveTo(xr-4,0);c.lineTo(xr+4,0);c.lineTo(xr-76,360);c.lineTo(xr-84,360);c.closePath();c.fill();c.restore();}
    /* 로고 스팅어 */
    if(sting){const tt=t-4.9,dim=sstep(0,.3,tt)*(1-sstep(1.3,1.5,tt));c.fillStyle='rgba(0,0,0,'+.85*dim+')';c.fillRect(0,0,640,360);
      const rp=E.outC(seg(tt,0,.6)),sc=E.outBack(seg(tt,.3,.8)),mv=E.outC(seg(tt,1.4,1.7)),cx=320+(596-320)*mv,cy=180+(30-180)*mv,k=1-.82*mv;
      c.save();c.translate(cx,cy);c.scale(k,k);c.strokeStyle='#ff8a3d';c.lineWidth=5;c.beginPath();c.arc(0,0,56,-Math.PI/2,-Math.PI/2+TAU*rp);c.stroke();
      c.save();c.scale(sc,sc);const g=c.createRadialGradient(-12,-12,2,0,0,32);g.addColorStop(0,'#ffd9b0');g.addColorStop(1,'#ff8a3d');c.fillStyle=g;c.beginPath();c.arc(0,0,28,0,TAU);c.fill();c.restore();
      if(tt>.7&&tt<1.2){const gx=-70+(tt-.7)/.5*140;c.save();c.beginPath();c.arc(0,0,60,0,TAU);c.arc(0,0,50,0,TAU,true);c.clip();const gg=c.createLinearGradient(gx-14,0,gx+14,0);gg.addColorStop(0,'rgba(255,255,255,0)');gg.addColorStop(.5,'rgba(255,255,255,.9)');gg.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gg;c.fillRect(gx-14,-60,28,120);c.restore();}
      c.globalAlpha=sstep(.5,.9,tt)*(1-mv);txt2(c,'OMNIARK',0,100,18,'#f4efe4',700,'center');c.globalAlpha=1;c.restore();}
    const lab2=t<.9?'0. 안전 영역(화면 가장자리 여백)':t<3.2?'① 로어서드 — 이름·직함':t<4.9?'② 챕터 카드 — 구간 전환':t<6.6?'③ 로고 스팅어 → ④ 워터마크':'④ 워터마크(계속 켜 둠)';
    rr(c,14,14,260,20,10);c.fillStyle='rgba(0,0,0,.65)';c.fill();txt2(c,lab2,26,28,11,'#f4efe4',700);
    cap(c,a?'안전 영역 안에 배치 · 막대가 자라고 글자가 마스크 속에서 올라옴 · 비스듬한 와이프 · 링이 그려지고 반짝임':'연출 전: 같은 그래픽이 움직임 없이 팝업으로 나타났다 사라짐',16,350);
  }
};
export default demo;
