// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d28. 직접 고치지 않는다 — 응용 팁 'squash' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas } from "./helpers.js";
import { TAU, bgFill, cap, clamp01 } from "./shared/common.js";

const JB={g:1400,H0:170,e:.62,t0:.5,floor:268,r:32};
const JB_SEG=(()=>{                       /* 바닥에 닿는 시각과 속도를 미리 계산 */
  const S=[];let t=JB.t0,v=0,H=JB.H0;S.push({ti:t+Math.sqrt(2*H/JB.g),vi:Math.sqrt(2*JB.g*H)});
  for(let n=0;n<8;n++){const vi=S[n].vi*JB.e,Hn=vi*vi/(2*JB.g);if(Hn<1.2)break;S.push({ti:S[n].ti+2*vi/JB.g,vi:vi});}
  return S;
})();
function jbState(t){                      /* 시각 → 공 바닥의 높이, 속도, 가장 가까운 충격까지의 시간 */
  const T0=JB.t0,g=JB.g;if(t<T0)return {h:JB.H0,v:0,seg:-1};
  for(let k=0;k<JB_SEG.length;k++){
    const hit=JB_SEG[k].ti;
    if(t<hit){
      if(k===0){const u=t-T0;return {h:JB.H0-.5*g*u*u,v:-g*u,seg:0};}
      const vi=JB_SEG[k-1].vi*JB.e,u=t-JB_SEG[k-1].ti;return {h:Math.max(0,vi*u-.5*g*u*u),v:vi-g*u,seg:k};
    }
  }
  return {h:0,v:0,seg:JB_SEG.length};
}

const demo = {
  dur: 4.6, rest: 4.2, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;
    const fy=JB.floor,r=JB.r,st=jbState(t);
    const ts=JB_SEG[JB_SEG.length-1].ti,x=140+330*E.outC(seg(t,JB.t0,ts+.2));
    bgFill(c,'#0b0e16','#07090e');
    const fl=c.createLinearGradient(0,fy,0,360);fl.addColorStop(0,'#141a26');fl.addColorStop(1,'#0a0d14');c.fillStyle=fl;c.fillRect(0,fy,640,360-fy);
    c.fillStyle='rgba(255,255,255,.07)';c.fillRect(0,fy,640,1);
    const hh=st.h;
    if(!a){                                   /* 연출 전: 같은 궤적, 하지만 딱딱한 공(변형·접지 반응 없음) */
      c.fillStyle='#ff8a3d';c.beginPath();c.arc(x,fy-hh-r,r,0,TAU);c.fill();
      cap(c,'연출 전: 같은 궤적이지만 공이 변형되지 않음 → 바닥에 닿아도 무게가 느껴지지 않음',16,344);return;
    }
    let sy=1,sx=1;
    const q=Math.min(1,Math.abs(st.v)/(JB_SEG[0].vi));
    if(t<JB.t0){const an=.14*E.outC(seg(t,.05,.4))*(1-seg(t,.4,.6));sy=1-an;sx=1/sy;}
    else{
      sy=1+.34*Math.pow(q,1.1);
      let dmin=9,vimp=0;JB_SEG.forEach(S=>{const d=Math.abs(t-S.ti);if(d<dmin){dmin=d;vimp=S.vi;}});
      const w=.05+.03*vimp/JB_SEG[0].vi;
      if(dmin<w){const am=.65*Math.pow(vimp/JB_SEG[0].vi,.8),u=1-dmin/w;sy=(1+.34*q)*(1-am*u*u*(3-2*u));}
      if(t>ts){const u=t-ts;sy*=1+.07*Math.exp(-5*u)*Math.cos(26*u);}
      sx=1/sy;
    }
    /* 접지 그림자·충격 고리 */
    const sh=clamp01(1-hh/320),sw=r*(1.15+.35*(sx-1)+.5*(1-sh));
    c.fillStyle='rgba(0,0,0,'+(.2+.4*sh)+')';c.beginPath();c.ellipse(x,fy+5,sw*(.7+.3*sh),5*(.6+.4*sh),0,0,TAU);c.fill();
    JB_SEG.forEach(S=>{const u=(t-S.ti)/.5;if(u<0||u>1)return;c.globalAlpha=(1-u)*.5*S.vi/JB_SEG[0].vi;c.strokeStyle='#ffb27a';c.lineWidth=1.3;c.beginPath();c.ellipse(x,fy+4,r*(.9+u*2.2),r*(.9+u*2.2)*.16,0,0,TAU);c.stroke();});
    c.globalAlpha=1;
    const drawBall=(rev)=>{
      c.save();c.translate(x,rev?fy+hh:fy-hh);if(rev)c.scale(1,-1);
      c.scale(sx,sy);
      const gr=c.createRadialGradient(-r*.35,-r*1.35,r*.08,-r*.1,-r*.9,r*1.15);gr.addColorStop(0,'#ffe3c2');gr.addColorStop(.28,'#ff9a52');gr.addColorStop(.75,'#e0561c');gr.addColorStop(1,'#7a2a0a');
      c.fillStyle=gr;c.beginPath();c.arc(0,-r,r,0,TAU);c.fill();
      const rl=c.createRadialGradient(r*.1,-r*.1,r*.2,0,-r,r);rl.addColorStop(.7,'rgba(255,140,70,0)');rl.addColorStop(1,'rgba(255,140,70,.45)');c.fillStyle=rl;c.beginPath();c.arc(0,-r,r,0,TAU);c.fill();
      c.fillStyle='rgba(255,255,255,.75)';c.beginPath();c.ellipse(-r*.38,-r*1.52,r*.2,r*.11,-.5,0,TAU);c.fill();
      c.restore();
    };
    c.save();c.beginPath();c.rect(0,fy,640,328-fy);c.clip();c.globalAlpha=.16*clamp01(1-hh/70);drawBall(true);c.globalAlpha=1;const fd=c.createLinearGradient(0,fy+10,0,328);fd.addColorStop(0,'rgba(18,24,36,0)');fd.addColorStop(1,'rgba(12,16,24,1)');c.fillStyle=fd;c.fillRect(0,fy,640,328-fy);c.restore();c.globalAlpha=1;
    drawBall(false);
    cap(c,'떨어질수록 길어지고 닿는 순간 납작 · 부피 유지(가로=1/세로) · 그림자·충격 고리가 같이 반응',16,344);
  }
};
export default demo;
