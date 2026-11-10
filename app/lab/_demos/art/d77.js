// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d77. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { EZ, TAU, UI_MONO, bgFill, cap, ezBall, ezShadow, txt2, txtk, uiReset } from "./shared/common.js";

const A77={P0:[90,238],C:[320,6],P1:[550,238],T0:.4,T1:2.0,GR:252,N:16};
function a77pos(v,arc){const x0=A77.P0[0],y0=A77.P0[1],x1=A77.P1[0],y1=A77.P1[1];if(!arc)return [x0+(x1-x0)*v,y0+(y1-y0)*v];const m=1-v;return [m*m*x0+2*m*v*A77.C[0]+v*v*x1,m*m*y0+2*m*v*A77.C[1]+v*v*y1];}
function a77len(arc){let L=0,p=a77pos(0,arc);for(let i=1;i<=120;i++){const q=a77pos(i/120,arc);L+=Math.hypot(q[0]-p[0],q[1]-p[1]);p=q;}return L;}

const demo = {
  dur: 3.4, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0d111a','#06080c');
    const f=a?EZ.inOutQ:EZ.linear,col=a?'#ff8a3d':'#8b94a3',GR=A77.GR,u=seg(t,A77.T0,A77.T1);
    /* 바닥 + 발판 */
    const fg=c.createLinearGradient(0,GR,0,282);fg.addColorStop(0,'#1a2030');fg.addColorStop(1,'#0a0d14');c.fillStyle=fg;c.fillRect(0,GR,640,30);c.fillStyle='rgba(255,255,255,.12)';c.fillRect(0,GR,640,1);
    [A77.P0,A77.P1].forEach((p,i)=>{ezShadow(c,p[0],GR+2,30,6,.5);c.strokeStyle=i?'#3ecf8e':'#6fd3ff';c.lineWidth=1.5;c.beginPath();c.ellipse(p[0],GR+2,22,5,0,0,TAU);c.stroke();txtk(c,i?'도착':'출발',p[0],GR+22,8.5,i?'#3ecf8e':'#6fd3ff','center');});
    /* 경로선 */
    c.strokeStyle='rgba(255,255,255,.16)';c.lineWidth=1.2;c.setLineDash([4,4]);c.beginPath();for(let i=0;i<=60;i++){const p=a77pos(i/60,a);i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.setLineDash([]);
    /* 0.1초마다 남기는 잔상(어니언 스킨) */
    const pts=[];for(let k=0;k<=A77.N;k++){const tk=A77.T0+k*.1,v=f(seg(tk,A77.T0,A77.T1));pts.push({tk,v,p:a77pos(v,a)});}
    pts.forEach((g,k)=>{if(t<g.tk)return;ezBall(c,g.p[0],g.p[1],8.5,col,.5);
      c.fillStyle='rgba(255,255,255,.5)';c.font='500 7.5px '+UI_MONO;c.textAlign='center';c.fillText(String(k),g.p[0],g.p[1]-12);});
    /* 지금의 공 */
    const v=f(u),P=a77pos(v,a),h=Math.max(0,GR-12-P[1]),sc=1-Math.min(.6,h/300);
    ezShadow(c,P[0],GR+2,14*sc,4*sc,.45*sc+.1);ezBall(c,P[0],P[1],12,col);
    if(t>A77.T1&&t<A77.T1+.45){const q=(t-A77.T1)/.45;c.strokeStyle='#3ecf8e';c.globalAlpha=.7*(1-q);c.lineWidth=1.6;c.beginPath();c.ellipse(A77.P1[0],GR+2,22+30*EZ.outC(q),5+7*EZ.outC(q),0,0,TAU);c.stroke();c.globalAlpha=1;}
    /* 이름표 */
    rr(c,14,12,a?178:150,20,10);c.fillStyle='rgba(0,0,0,.65)';c.fill();txt2(c,a?'호(arc) + 느리게 시작·끝':'직선 + 등속',26,26,11.5,a?'#ffb27f':'#dfe5ee',700);
    /* 간격 표(타이밍 차트): 잔상이 지나온 거리의 비율 */
    const L0=90,LW=460,Y=306;
    c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=1;c.beginPath();c.moveTo(L0,Y+.5);c.lineTo(L0+LW,Y+.5);c.stroke();txtk(c,'간격 표',14,Y+3,9,'#8b94a3');
    pts.forEach((g,k)=>{if(t<g.tk)return;c.fillStyle=col;c.fillRect(L0+g.v*LW-.5,Y-7,1.4,14);});
    const gaps=[];for(let k=1;k<pts.length;k++)gaps.push(Math.hypot(pts[k].p[0]-pts[k-1].p[0],pts[k].p[1]-pts[k-1].p[1]));
    const gmax=Math.max(...gaps),gmin=Math.min(...gaps),ratio=gmax/gmin,Lp=a77len(a),Ls=a77len(false);
    txtk(c,'경로 길이 '+Math.round(Lp)+'px (직선 '+Math.round(Ls)+'px) · 잔상 간격 최소 '+gmin.toFixed(1)+' ~ 최대 '+gmax.toFixed(1)+'px · '+ratio.toFixed(1)+'배',L0,Y+22,9,a?'#3ecf8e':'#ff7a70');
    cap(c,a?'연출 후: 호를 그리며 가고, 출발·도착 근처는 잔상이 촘촘(느림) · 가운데는 넓음(빠름)':'연출 전: 직선에 간격이 똑같다 — 잔상이 같은 폭으로 늘어서서 기계적',16,350);
  }
};
export default demo;
