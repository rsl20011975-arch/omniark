// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d43. 직접 고치지 않는다 — 응용 팁 'greenmarker' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas } from "./helpers.js";
import { TAU, TY_DISP, bgFill, cap, mixrgb, sstep, txt2, tyDraw, uiReset } from "./shared/common.js";

function hdPts(pts,seed,amp){const r=rng(seed);return pts.map(p=>[p[0]+(r()-.5)*amp*2,p[1]+(r()-.5)*amp*2]);}
function hdStroke(c,pts,prog,col,w){
  if(prog<=0)return;const n=pts.length-1,k=Math.min(1,prog)*n,f=Math.floor(k);c.beginPath();c.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<=Math.min(f,n);i++)c.lineTo(pts[i][0],pts[i][1]);
  if(f<n){const u=k-f;c.lineTo(pts[f][0]+(pts[f+1][0]-pts[f][0])*u,pts[f][1]+(pts[f+1][1]-pts[f][1])*u);}
  c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.stroke();
}

const demo = {
  dur: 5, rest: 4.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const font='400 46px '+TY_DISP,y=176;c.font=font;
    const w1=c.measureText('강조는 ').width,w2=c.measureText('하나만').width,w3s=c.measureText('강조는 하나만 ').width,w3=c.measureText('해야 한다').width,tot=c.measureText('강조는 하나만 해야 한다').width,x0=320-tot/2;
    const xs2=x0+w1,xs3=x0+w3s;
    if(!a){tyDraw(c,'강조는 ',x0,y,font,'#f4efe4');tyDraw(c,'하나만',xs2,y,font,'#ff8a3d');tyDraw(c,' 해야 한다',x0+w1+w2,y,font,'#f4efe4');
      cap(c,'연출 전: 색만 한 단어에 칠함 → 어디를 먼저 보고 무엇이 중요한지 “그어 주는” 동작이 없음',16,344);return;}
    /* 형광펜: 오른쪽으로 번지듯 칠해짐 */
    const hp=E.outC(seg(t,.6,1.25));
    if(hp>0){const xl=xs2-8,xr=xl+(w2+16)*hp,yt=y-44,yb=y+10;c.fillStyle='rgba(140,235,110,.95)';c.beginPath();c.moveTo(xl,yt+2);c.lineTo(xr+2,yt-1);c.lineTo(xr-1,yb+2);c.lineTo(xl+3,yb);c.closePath();c.fill();}
    tyDraw(c,'강조는 ',x0,y,font,'#f4efe4');tyDraw(c,'하나만',xs2,y,font,'rgb('+mixrgb([244,239,228],[26,19,8],sstep(.5,.9,hp)).map(Math.round)+')');tyDraw(c,' 해야 한다',x0+w1+w2,y,font,'#f4efe4');
    /* 밑줄 */
    const up=E.outC(seg(t,1.5,2.0));
    if(up>0){const P=[];for(let i=0;i<=26;i++)P.push([x0+(w1-10)*i/26,y+16+Math.sin(i*.75)*1.3+i*.06]);
      hdStroke(c,hdPts(P,11,.6),up,'#ff8a3d',3.2);c.globalAlpha=.45;hdStroke(c,hdPts(P.map(p=>[p[0]+2,p[1]+2.2]),12,.6),up,'#ff8a3d',2);c.globalAlpha=1;}
    /* 동그라미(1.1바퀴, 살짝 나선) */
    const cp=E.outC(seg(t,2.4,3.2));
    if(cp>0){const cx=xs3+w3/2,cy=y-16,rx=w3/2+18,ry=36,P=[];for(let i=0;i<=72;i++){const th=-2.3+TAU*1.1*i/72,g=1+.05*i/72;P.push([cx+Math.cos(th)*rx*g,cy+Math.sin(th)*ry*g]);}
      hdStroke(c,hdPts(P,21,.9),cp,'#ff8a3d',3.4);c.globalAlpha=.4;hdStroke(c,hdPts(P.map(p=>[p[0]+1.6,p[1]+1.2]),22,.9),cp,'#ffb27f',2);c.globalAlpha=1;}
    /* 메모와 화살표 */
    const np=E.outC(seg(t,3.3,3.8));
    if(np>0){c.globalAlpha=np;txt2(c,'여기가 핵심!',xs2+w2/2+34,282+8*(1-np),19,'#ffb27f',700,'center');c.globalAlpha=1;}
    const ap=E.outC(seg(t,3.6,4.2));
    if(ap>0){const sx=xs2+w2/2+22,sy=262,ex=xs2+w2/2-2,ey=y+26,qx=sx+46,qy=(sy+ey)/2,P=[];for(let i=0;i<=22;i++){const u=i/22,b=1-u;P.push([b*b*sx+2*b*u*qx+u*u*ex,b*b*sy+2*b*u*qy+u*u*ey]);}
      hdStroke(c,hdPts(P,31,.6),ap,'#ff8a3d',3);
      const hp2=seg(t,4.05,4.3);if(hp2>0){const ang=Math.atan2(P[22][1]-P[19][1],P[22][0]-P[19][0]);[.6,-.6].forEach(da=>{const L=14*hp2;c.beginPath();c.moveTo(ex,ey);c.lineTo(ex-Math.cos(ang+da)*L,ey-Math.sin(ang+da)*L);c.strokeStyle='#ff8a3d';c.lineWidth=3;c.lineCap='round';c.stroke();});}}
    cap(c,'형광펜 → 밑줄 → 동그라미 → 메모 + 화살표 순서로 “그어짐” · 떨림과 겹선',16,344);
  }
};
export default demo;
