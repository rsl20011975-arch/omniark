// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d41. 직접 고치지 않는다 — 응용 팁 'bigwave' 적용본
/* eslint-disable */
// @ts-nocheck

import { canvas } from "./helpers.js";
import { TY_DISP, UI_SANS, bgFill, cap, mixrgb, txtm, tyDraw, tyLay, uiReset } from "./shared/common.js";

const WV_L=[{t:'WAVE 파도처럼',y:100,f:'400 42px '+TY_DISP},{t:'굵기가 지나간다',y:190,f:'400 42px '+UI_SANS},{t:'자간이 숨 쉰다',y:278,f:'600 36px '+UI_SANS}];

const demo = {
  dur: 5.2, rest: 2.4, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    c.strokeStyle='rgba(255,255,255,.05)';c.lineWidth=1;WV_L.forEach(l=>{c.beginPath();c.moveTo(24,l.y+10.5);c.lineTo(616,l.y+10.5);c.stroke();});
    const cream=[244,239,228],org=[255,138,61];
    /* 1. 글자별 위상으로 파도 */
    {const l=WV_L[0],L=tyLay(c,l.t,l.f,320,1);
      L.forEach((o,i)=>{if(o.ch===' ')return;const ph=a?Math.sin(t*4.2-i*.55):0,cx=o.x+o.w/2;c.save();c.translate(cx,l.y-14);c.rotate(a?.07*Math.sin(t*4.2-i*.55+1.2):0);c.translate(-cx,-(l.y-14));
        tyDraw(c,o.ch,o.x,l.y-16*ph,l.f,'rgb('+mixrgb(cream,org,a?(ph+1)/2:0).map(Math.round)+')');c.restore();});}
    /* 2. 굵기가 지나감(외곽선 두께로 굵기를 흉내) */
    {const l=WV_L[1],L=tyLay(c,l.t,l.f,320,0),n=L.length,pos=-2+((t*5)%(n+6));
      L.forEach((o,i)=>{if(o.ch===' ')return;const w=a?3.2*Math.exp(-Math.pow((i-pos)/1.7,2)):0,col='rgb('+mixrgb(cream,org,Math.min(1,w/3.2)).map(Math.round)+')';
        c.font=l.f;if(w>.05){c.save();c.lineJoin='round';c.strokeStyle=col;c.lineWidth=w;c.textAlign='left';c.textBaseline='alphabetic';c.strokeText(o.ch,o.x,l.y);c.restore();}tyDraw(c,o.ch,o.x,l.y,l.f,col);});}
    /* 3. 자간이 숨 쉼 */
    {const l=WV_L[2],tr=a?2+16*(.5-.5*Math.cos(t*1.6)):2,L=tyLay(c,l.t,l.f,320,tr);L.forEach(o=>{if(o.ch!==' ')tyDraw(c,o.ch,o.x,l.y,l.f,'#f4efe4');});
      if(a)txtm(c,'tracking '+tr.toFixed(1)+'px',24,l.y+26,9.5,'#5b6577');}
    if(a){txtm(c,'offset −16 ~ +16px · tilt ±4°',24,WV_L[0].y+26,9.5,'#5b6577');txtm(c,'outline 0 ~ 3.2px (fake weight)',24,WV_L[1].y+26,9.5,'#5b6577');}
    cap(c,a?'글자마다 위상을 어긋나게 → 파도 · 지나가는 파동에 굵기 · 자간을 사인으로':'연출 전: 세 줄 모두 가만히 있음 → 서체와 크기만 보임',16,348);
  }
};
export default demo;
