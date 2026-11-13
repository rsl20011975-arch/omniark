// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d55. 직접 고치지 않는다 — 응용 팁 'rainbow' 적용본
/* eslint-disable */
// @ts-nocheck

import { rng, canvas, rr } from "./helpers.js";
import { TAU, TY_DISP, bgFill, cap, txtm, uiReset } from "./shared/common.js";

function hlStar(c,x,y,r,al){c.save();c.globalAlpha=al;c.fillStyle='#fff';c.beginPath();for(let i=0;i<8;i++){const rd=i%2?r*.18:r,an=i*Math.PI/4;c.lineTo(x+Math.cos(an)*rd,y+Math.sin(an)*rd);}c.closePath();c.fill();c.restore();}
const HL_SP=Array.from({length:22},(_,i)=>{const r=rng(50+i);return {x:(r()-.5)*170,y:(r()-.5)*240,r:2.5+r()*3.5,ph:r()*TAU};});

const demo = {
  dur: 5, rest: 2.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#06070c';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0a0c14','#05060a');
    const tilt=a?.55*Math.sin(t*.9):0,sx=Math.max(.42,Math.cos(tilt)),fr=(t%1.7)/1.7,burst=a&&fr<.1,ab=a?(burst?1.2+6*Math.sin(fr/.1*Math.PI):1.2):0,hue=a?(t*60)%360:0;
    if(a){const gl=c.createRadialGradient(320,180,10,320,180,240);gl.addColorStop(0,'hsla('+hue+',90%,60%,.22)');gl.addColorStop(1,'hsla('+hue+',90%,60%,0)');c.fillStyle=gl;c.fillRect(0,0,640,360);}
    c.save();c.translate(320,180);c.scale(sx,1);
    c.save();c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=30;c.shadowOffsetY=14;rr(c,-95,-131,190,262,16);c.fillStyle='#10141c';c.fill();c.restore();
    c.save();rr(c,-95,-131,190,262,16);c.clip();
    const bg=c.createLinearGradient(0,-131,0,131);bg.addColorStop(0,a?'#171c2a':'#2a2f3b');bg.addColorStop(1,a?'#0a0c14':'#20252f');c.fillStyle=bg;c.fillRect(-95,-131,190,262);
    if(a){
      if(c.createConicGradient){const cg=c.createConicGradient(t*.7+tilt*3,tilt*120,-20);for(let k=0;k<=6;k++)cg.addColorStop(k/6,'hsl('+(k*60)+',90%,60%)');c.globalCompositeOperation='screen';c.globalAlpha=.9;c.fillStyle=cg;c.fillRect(-95,-131,190,262);c.globalAlpha=1;c.globalCompositeOperation='source-over';}
      c.lineWidth=1;for(let k=-30;k<30;k++){c.strokeStyle='hsla('+((k*9+t*60)%360+360)%360+',80%,60%,.1)';c.beginPath();c.moveTo(-130+k*5,-140);c.lineTo(130+k*5,140);c.stroke();}
      c.fillStyle='rgba(255,255,255,.07)';for(let y=((t*30)%4)-131;y<131;y+=4)c.fillRect(-95,y,190,1);
      c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1.2;c.beginPath();c.arc(0,34,50,0,TAU);c.stroke();c.beginPath();c.arc(0,34,34,0,TAU);c.stroke();for(let k=0;k<8;k++){const an=k*Math.PI/4;c.beginPath();c.moveTo(Math.cos(an)*34,34+Math.sin(an)*34);c.lineTo(Math.cos(an)*50,34+Math.sin(an)*50);c.stroke();}
      HL_SP.forEach(p=>{const v=Math.pow(Math.max(0,Math.sin(t*3+p.ph)),8);if(v>.02)hlStar(c,p.x,p.y,p.r*(.6+.8*v),v);});
    }else{c.strokeStyle='#3a4254';c.lineWidth=1.2;c.beginPath();c.arc(0,34,50,0,TAU);c.stroke();}
    c.restore();
    c.font='400 46px '+TY_DISP;c.textAlign='center';c.textBaseline='alphabetic';
    if(a){c.globalCompositeOperation='lighter';[['#ff0000',-ab],['#00ff00',0],['#0000ff',ab]].forEach(ch=>{c.fillStyle=ch[0];c.fillText('HOLO',ch[1]+(burst?3*Math.sin(fr*400):0),-70);});c.globalCompositeOperation='source-over';}
    else{c.fillStyle='#dfe5ee';c.fillText('HOLO',0,-70);}
    txtm(c,a?'AB '+ab.toFixed(1)+'px':'AB 0px',0,-48,9.5,a?'#ffb27f':'#8b94a3','center');
    const bgd=c.createConicGradient?c.createConicGradient(t*.7,0,0):null;
    if(a&&bgd){for(let k=0;k<=6;k++)bgd.addColorStop(k/6,'hsl('+(k*60)+',90%,60%)');rr(c,-94.5,-130.5,189,261,16);c.strokeStyle=bgd;c.lineWidth=2.2;c.stroke();}else{rr(c,-94.5,-130.5,189,261,16);c.strokeStyle='#3a4254';c.lineWidth=1.2;c.stroke();}
    c.restore();
    cap(c,a?'기울면 무지개빛이 변함 · 스캔선 · 반짝이는 별 · 가끔 색수차가 커짐':'연출 전: 평평한 회색 카드 + 단색 글자 → 빛이나 각도에 반응하지 않음',16,350);
  }
};
export default demo;
