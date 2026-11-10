// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d40. 직접 고치지 않는다 — 응용 팁 'deepextrude' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas } from "./helpers.js";
import { TAU, TY_DISP, bgFill, cap, mixrgb, txt2, tyDraw, tyLay, uiReset } from "./shared/common.js";

const SL_TXT='지금 달라집니다';

const demo = {
  dur: 3.8, rest: 3.2, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#05070b');
    const font='400 70px '+TY_DISP,L=tyLay(c,SL_TXT,font,320,3),base=206,n=L.length,tiL=1.05+(n-1)*.07,tau0=t-tiL;
    if(!a){c.globalAlpha=E.outC(seg(t,.5,1.2));L.forEach(o=>tyDraw(c,o.ch,o.x,base,font,'#f4efe4'));c.globalAlpha=1;
      cap(c,'연출 전: 제목이 제자리에서 나타남 → 무게도 충격도 없어서 “지금 달라진다”가 안 들어옴',16,344);return;}
    const cam=1+(tau0>0?.035*Math.exp(-tau0*9):0),sh=tau0>0?7*Math.exp(-tau0*9):0;
    c.save();c.translate(320,180);c.scale(cam,cam);c.translate(-320,-180);c.translate(sh*Math.sin(tau0*85),sh*Math.cos(tau0*67));
    c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.ellipse(320,base+22,250*E.outC(seg(t,.8,1.5)),9,0,0,TAU);c.fill();
    if(tau0>0&&tau0<.7){[0,.1].forEach((dl,k)=>{const q=(tau0-dl)/.6;if(q<=0||q>=1)return;const rx=50+340*E.outC(q);c.globalAlpha=.65*(1-q);c.strokeStyle=k?'#ffb27f':'#ff8a3d';c.lineWidth=2.2-k*.8;c.beginPath();c.ellipse(320,base+18,rx,rx*.1,0,0,TAU);c.stroke();});c.globalAlpha=1;}
    L.forEach((o,i)=>{
      if(o.ch===' ')return;const d=i*.07,u=seg(t,.7+d,1.05+d);if(u<=0)return;
      const sc=3-2*E.inC(u),tau=t-(1.05+d),post=tau>0,sq=post?.22*Math.exp(-tau*12)*Math.cos(tau*34):0,sy=1-sq,sx=1+sq*.9,D=30*(post?1-.6*Math.exp(-tau*10):1),cx=o.x+o.w/2;
      c.save();c.globalAlpha=Math.min(1,u*2.5);c.translate(cx,base);c.scale(sc*sx,sc*sy);c.translate(-cx,-base);
      for(let k=Math.round(D);k>=1;k--){tyDraw(c,o.ch,o.x+k*.55,base+k*.85,font,'rgb('+mixrgb([112,42,10],[236,112,38],1-k/D).map(Math.round)+')');}
      const g=c.createLinearGradient(0,base-64,0,base);g.addColorStop(0,'#fff4e4');g.addColorStop(1,'#ffb27f');tyDraw(c,o.ch,o.x,base,font,g);c.restore();
    });
    c.restore();
    if(tau0>0&&tau0<.15){c.fillStyle='rgba(255,255,255,'+.28*(1-tau0/.15)+')';c.fillRect(0,0,640,360);}
    const sb=E.outC(seg(t,2.0,2.5));if(sb>0){c.globalAlpha=sb;txt2(c,'슬램 · 충격 · 안착',320,262-10*(1-sb),16,'#8b94a3',600,'center');c.globalAlpha=1;}
    cap(c,'글자마다 가속해서 내리꽂힘 → 닿는 순간 납작 · 화면 흔들림 · 충격파',16,344);
  }
};
export default demo;
