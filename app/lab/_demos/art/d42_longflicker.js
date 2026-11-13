// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d42. 직접 고치지 않는다 — 응용 팁 'longflicker' 적용본
/* eslint-disable */
// @ts-nocheck

import { canvas } from "./helpers.js";
import { TY_DISP, bgFill, cap, hash, tyDraw, tyLay, uiReset } from "./shared/common.js";

function neonI(i,t){const ts=.5+i*.42;if(t<ts)return 0;const k=t-ts;if(k<1.8)return hash(i,Math.floor(t*13))>.42?1:.1;
  let v=.97+.03*Math.sin(t*47+i);if(i===2){const q=((t-2.9)%2.3+2.3)%2.3;if(q<.14)v*=.25+.2*hash(7,Math.floor(t*30));}return v;}
function neonCh(c,ch,x,y,font,rgb,I){
  c.font=font;c.lineJoin='round';c.textAlign='left';c.textBaseline='alphabetic';
  c.strokeStyle='rgba(95,75,75,.6)';c.lineWidth=2;c.strokeText(ch,x,y);
  if(I>.02){c.save();c.shadowColor='rgba('+rgb+','+(.95*I)+')';c.shadowBlur=36*I;c.strokeStyle='rgba('+rgb+','+.38*I+')';c.lineWidth=9;c.strokeText(ch,x,y);
    c.shadowBlur=13*I;c.strokeStyle='rgba('+rgb+','+.75*I+')';c.lineWidth=4;c.strokeText(ch,x,y);c.restore();
    c.strokeStyle='rgba(255,244,236,'+.95*I+')';c.lineWidth=1.6;c.strokeText(ch,x,y);}
}

const demo = {
  dur: 4.4, rest: 3.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a080e';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0d0a12','#07060a');
    c.strokeStyle='rgba(255,255,255,.028)';c.lineWidth=1;for(let r=0;r<23;r++){const y=r*16;c.beginPath();c.moveTo(0,y+.5);c.lineTo(640,y+.5);c.stroke();for(let x=(r%2)*20;x<640;x+=40){c.beginPath();c.moveTo(x+.5,y);c.lineTo(x+.5,y+16);c.stroke();}}
    const f1='400 98px '+TY_DISP,f2='400 27px '+TY_DISP,L1=tyLay(c,'OPEN',f1,320,12),L2=tyLay(c,'연중무휴 · 24H',f2,320,5),y1=176,y2=232;
    if(!a){L1.forEach(o=>tyDraw(c,o.ch,o.x,y1,f1,'#ff8a3d'));L2.forEach(o=>tyDraw(c,o.ch,o.x,y2,f2,'#6fd3ff'));
      cap(c,'연출 전: 색만 칠한 글자 → 빛도 켜지는 과정도 없어서 “글자”일 뿐 “간판”이 아님',16,344);return;}
    const I=[0,1,2,3].map(i=>neonI(i,t)),Is=neonI(4,t),avg=(I[0]+I[1]+I[2]+I[3])/4;
    const wg=c.createRadialGradient(320,190,10,320,190,270);wg.addColorStop(0,'rgba(255,90,50,'+.2*avg+')');wg.addColorStop(1,'rgba(255,90,50,0)');c.fillStyle=wg;c.fillRect(0,0,640,360);
    if(Is>0){const wg2=c.createRadialGradient(320,228,5,320,228,170);wg2.addColorStop(0,'rgba(80,190,255,'+.12*Is+')');wg2.addColorStop(1,'rgba(80,190,255,0)');c.fillStyle=wg2;c.fillRect(0,0,640,360);}
    L1.forEach((o,i)=>neonCh(c,o.ch,o.x,y1,f1,'255,110,60',I[i]));
    L2.forEach(o=>{if(o.ch!==' ')neonCh(c,o.ch,o.x,y2,f2,'90,200,255',Is);});
    const vg=c.createRadialGradient(320,180,150,320,180,420);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');c.fillStyle=vg;c.fillRect(0,0,640,360);
    cap(c,'글자마다 점등 시각이 다르고 불안정하게 깜박임 · 안정 후 떨림 · 벽에 번지는 빛',16,344);
  }
};
export default demo;
