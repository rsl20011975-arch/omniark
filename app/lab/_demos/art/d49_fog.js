// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d49. 직접 고치지 않는다 — 응용 팁 'fog' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas, rr } from "./helpers.js";
import { TAU, TY_DISP, UI_SANS, bgFill, cap, txtm, uiReset } from "./shared/common.js";

const ZT={N:9,gap:1.25,F:300,col:[[255,138,61],[111,211,255],[190,150,255],[62,207,142],[255,206,84],[255,96,128],[111,211,255],[255,138,61],[190,150,255]],tt:['① 훅','② 문제','③ 원리','④ 만들기','⑤ 확인','⑥ 비교','⑦ 적용','⑧ 정리','⑨ 다음']};
const ZT_P=Array.from({length:46},(_,i)=>{const r=rng(300+i);return {x:(r()-.5)*3.6,y:(r()-.5)*2.2,z:r()*ZT.N*ZT.gap};});
function ztFrame(c,j,dz,cx,cy,t,al){
  const s=ZT.F/dz,w=.8*s,h=.45*s,col=ZT.col[j%ZT.col.length],ca=Math.max(0,Math.min(1,al));if(ca<=.01)return;
  c.save();c.globalAlpha=ca;rr(c,cx-w,cy-h,w*2,h*2,Math.max(4,10*s/300));const g=c.createLinearGradient(0,cy-h,0,cy+h);g.addColorStop(0,'rgba('+col+',.16)');g.addColorStop(1,'rgba('+col+',.04)');c.fillStyle=g;c.fill();
  c.lineWidth=Math.max(1,3.2*s/300);c.strokeStyle='rgb('+col+')';c.stroke();
  c.fillStyle='rgba('+col+',.9)';c.fillRect(cx-w,cy-h,Math.min(w*.5,70*s/300),Math.max(2,4*s/300));
  c.font='700 '+Math.max(5,19*s/300)+'px '+UI_SANS;c.fillStyle='#f4efe4';c.textAlign='left';c.textBaseline='alphabetic';c.fillText(ZT.tt[j],cx-w+14*s/300,cy-h+30*s/300);
  c.font='400 '+Math.max(8,130*s/300)+'px '+TY_DISP;c.fillStyle='rgba('+col+',.2)';c.textAlign='center';c.fillText(String(j+1),cx,cy+40*s/300);c.restore();
}

const demo = {
  dur: 5.2, rest: 2.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#05070c';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#080b14','#04050a');
    const e=a?E.inOutC(seg(t,.5,4.4)):0,zc=ZT.gap*6.2*e,sw=a?.06:0,cx0=320+(a?sw*ZT.F*Math.sin(t*1.3)*2:0),cy0=178+(a?.03*ZT.F*Math.cos(t*1.1)*2:0);
    const gl=c.createRadialGradient(320,180,5,320,180,260);gl.addColorStop(0,'rgba(111,211,255,.1)');gl.addColorStop(1,'rgba(111,211,255,0)');c.fillStyle=gl;c.fillRect(0,0,640,360);
    if(!a){const e0=E.inOutC(seg(t,.5,3.0));
      if(t<3.0)ztFrame(c,0,ZT.F/(ZT.F*(1+2*e0)),320,180,t,1);else ztFrame(c,1,1,320,180,t,1);
      cap(c,'연출 전: 첫 장면만 확대하다 컷 → 장면 사이의 공간 연결이 없음',16,350);return;}
    c.save();c.translate(320,180);c.rotate(.012*Math.sin(t*1.2));c.translate(-320,-180);
    /* 먼지 입자 */
    ZT_P.forEach(q=>{const dz=q.z-zc+1;if(dz<.3||dz>11)return;const s2=ZT.F/dz,px=cx0+q.x*s2,py=cy0+q.y*s2;c.globalAlpha=Math.min(1,(1-(dz-1)/10))*.55;c.fillStyle='#bfeaff';c.beginPath();c.arc(px,py,Math.max(.5,1.1*s2/180),0,TAU);c.fill();});
    c.globalAlpha=1;
    for(let j=ZT.N-1;j>=0;j--){const dz=j*ZT.gap-zc+1;if(dz<.22)continue;const fade=Math.min(1,dz/.7)*Math.max(0,1-(dz-1)/4);
      const cx=320+(cx0-320)*(1/dz)*1.0,cy=180+(cy0-180)*(1/dz)*1.0;ztFrame(c,j,dz,cx,cy,t,fade);}
    c.restore();
    const v=a?Math.abs((E.inOutC(seg(t+.02,.5,4.4))-e)/.02):0;
    for(let i=0;i<16;i++){const an=i/16*TAU+.2,r0=70+i%3*10,len=Math.min(120,v*6.5)*(.5+(i%4)/4);if(len<4)continue;c.strokeStyle='rgba(180,230,255,'+Math.min(.22,v*.035)+')';c.lineWidth=1;c.beginPath();c.moveTo(320+Math.cos(an)*(r0+60),180+Math.sin(an)*(r0+60)*.6);c.lineTo(320+Math.cos(an)*(r0+60+len),180+Math.sin(an)*(r0+60+len)*.6);c.stroke();}
    const vg=c.createRadialGradient(320,180,130,320,180,420);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');c.fillStyle=vg;c.fillRect(0,0,640,360);
    txtm(c,'DOLLY-THROUGH  z '+zc.toFixed(1)+' / '+(ZT.gap*(ZT.N-1)).toFixed(1),626,28,10,'#6fd3ff','right');
    cap(c,'카메라가 프레임 9개를 차례로 통과 · 가까운 것이 먼저 커져 지나감',16,350);
  }
};
export default demo;
