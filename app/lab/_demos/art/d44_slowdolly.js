// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d44. 직접 고치지 않는다 — 응용 팁 'slowdolly' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, cap, txtm, uiReset } from "./shared/common.js";

const DZ={d0:3,d1:8,f0:281,cy:170};
function dzP(x,y,z,d,f){const k=f/(z+d);return [320+x*k,DZ.cy-(y-.9)*k,k];}

const demo = {
  dur: 4.6, rest: 3.8, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0d1a';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);
    const e=E.inOutC(seg(t,.8,4.2)),d=a?DZ.d0+(DZ.d1-DZ.d0)*e:DZ.d0,f=a?DZ.f0*d/DZ.d0:DZ.f0*(1+1.67*e);
    const g=c.createLinearGradient(0,0,0,DZ.cy);g.addColorStop(0,'#090c18');g.addColorStop(1,'#1d2140');c.fillStyle=g;c.fillRect(0,0,640,360);
    const fg=c.createLinearGradient(0,DZ.cy,0,360);fg.addColorStop(0,'#151a2e');fg.addColorStop(1,'#080a14');c.fillStyle=fg;c.fillRect(0,DZ.cy,640,360-DZ.cy);
    /* 먼 문(밝은 출구) */
    {const p1=dzP(-.9,0,18,d,f),p2=dzP(.9,2.4,18,d,f);c.save();c.shadowColor='rgba(255,190,120,.45)';c.shadowBlur=14;const dg=c.createLinearGradient(0,p2[1],0,p1[1]);dg.addColorStop(0,'#fff0d4');dg.addColorStop(1,'#ffb066');c.fillStyle=dg;c.fillRect(p1[0],p2[1],p2[0]-p1[0],p1[1]-p2[1]);c.restore();}
    /* 바닥 격자 */
    c.lineWidth=1;
    for(let z=0;z<=28;z+=1.4){const p=dzP(0,0,z,d,f),a1=.34*(1-z/32);if(p[1]>360||p[1]<DZ.cy)continue;c.strokeStyle='rgba(111,211,255,'+a1+')';c.beginPath();c.moveTo(0,p[1]);c.lineTo(640,p[1]);c.stroke();}
    for(let x=-9.6;x<=9.6;x+=1.2){const p0=dzP(x,0,-d+1.1,d,f),p1=dzP(x,0,30,d,f);c.strokeStyle='rgba(111,211,255,.2)';c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
    /* 기둥 */
    const zs=[15.2,13,10.8,8.6,6.4,4.2,2];
    zs.forEach(z=>{[-4.6,-2.3,2.3,4.6].forEach(x=>{if(Math.abs(x)>3&&z<6)return;const p1=dzP(x-.22,0,z,d,f),p2=dzP(x+.22,3.4,z,d,f),fade=Math.max(0,1-z/19);
      const pg=c.createLinearGradient(p1[0],0,p2[0],0);pg.addColorStop(0,'rgb('+Math.round(40+60*fade)+','+Math.round(44+66*fade)+','+Math.round(70+90*fade)+')');pg.addColorStop(1,'rgb('+Math.round(18+26*fade)+','+Math.round(20+28*fade)+','+Math.round(34+44*fade)+')');
      c.fillStyle=pg;c.fillRect(p1[0],p2[1],p2[0]-p1[0],p1[1]-p2[1]);
      const s1=dzP(x-.22,1.05,z,d,f),s2=dzP(x+.22,.9,z,d,f);c.fillStyle='rgba(111,211,255,'+(.55*fade+.1)+')';c.fillRect(s1[0],s2[1],s2[0]-s1[0],s1[1]-s2[1]);});
      const b1=dzP(-4.6,3.4,z,d,f),b2=dzP(4.6,3.4,z,d,f);c.strokeStyle='rgba(111,211,255,'+.14*Math.max(0,1-z/19)+')';c.lineWidth=1.4;c.beginPath();c.moveTo(b1[0],b1[1]);c.lineTo(b2[0],b2[1]);c.stroke();});
    /* 피사체 (z=0) */
    {const k=f/d,bx=320,by=DZ.cy+.9*k,u=v=>v*k;
      c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.ellipse(bx,by+u(.02),u(.5),u(.1),0,0,TAU);c.fill();
      c.fillStyle='#1b2030';c.fillRect(bx-u(.18),by-u(.55),u(.13),u(.55));c.fillRect(bx+u(.05),by-u(.55),u(.13),u(.55));
      const jg=c.createLinearGradient(bx-u(.3),0,bx+u(.3),0);jg.addColorStop(0,'#ffb27f');jg.addColorStop(.6,'#ff8a3d');jg.addColorStop(1,'#c4561a');
      c.fillStyle=jg;c.beginPath();c.moveTo(bx-u(.3),by-u(1.18));c.lineTo(bx+u(.3),by-u(1.18));c.lineTo(bx+u(.22),by-u(.46));c.lineTo(bx-u(.22),by-u(.46));c.closePath();c.fill();
      c.fillStyle='#f1c9a5';c.beginPath();c.arc(bx,by-u(1.42),u(.21),0,TAU);c.fill();c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.arc(bx+u(.05),by-u(1.4),u(.2),-.9,1.2);c.lineTo(bx+u(.05),by-u(1.4));c.fill();}
    const vg=c.createRadialGradient(320,190,120,320,190,420);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.5)');c.fillStyle=vg;c.fillRect(0,0,640,360);
    /* 위에서 본 도식 */
    const fov=2*Math.atan(320/f)*180/Math.PI,ha=Math.atan(320/f),cxp=606-d*8.6;
    rr(c,512,262,116,88,8);c.fillStyle='rgba(8,10,18,.82)';c.fill();c.strokeStyle='#262e3d';c.lineWidth=1;c.stroke();
    c.save();rr(c,512,262,116,88,8);c.clip();c.fillStyle='rgba(111,211,255,.17)';c.beginPath();c.moveTo(cxp,310);c.lineTo(cxp+70*Math.cos(ha),310-70*Math.sin(ha));c.lineTo(cxp+70*Math.cos(ha),310+70*Math.sin(ha));c.closePath();c.fill();
    c.strokeStyle='rgba(111,211,255,.7)';c.beginPath();c.moveTo(cxp+70*Math.cos(ha),310-70*Math.sin(ha));c.lineTo(cxp,310);c.lineTo(cxp+70*Math.cos(ha),310+70*Math.sin(ha));c.stroke();c.restore();
    c.fillStyle='#ff8a3d';c.beginPath();c.arc(606,310,4.5,0,TAU);c.fill();c.fillStyle='#dfe5ee';c.fillRect(cxp-5,305,7,10);
    txtm(c,'FOV '+Math.round(fov)+'°',520,278,10,'#6fd3ff');
    txtm(c,a?'dolly  '+d.toFixed(1)+' m  (뒤로)':'dolly  3.0 m  (고정)',18,30,10.5,'#ffb27f');    txtm(c,'zoom   ×'+(f/DZ.f0).toFixed(2)+'  (줌 인)',18,45,10.5,'#6fd3ff');txtm(c,a?'피사체 높이: 같음':'피사체 높이: 커짐',18,60,10.5,a?'#3ecf8e':'#8b94a3');
    cap(c,a?'카메라는 뒤로, 렌즈는 줌 인 → 피사체 크기는 같고 배경만 압축됨':'연출 전: 그냥 줌 인 → 피사체와 배경이 같이 커질 뿐 공간이 일그러지지 않음',16,348);
  }
};
export default demo;
