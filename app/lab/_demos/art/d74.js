// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d74. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { EZ, TAU, bgFill, cap, ezBall, ezMax, ezShadow, txt2, txtk, txtm, uiReset } from "./shared/common.js";
import { ezPlot } from "./shared/g74.js";

const ER=[
  {n:'등속',en:'linear',f:EZ.linear,col:'#8b94a3'},
  {n:'가속',en:'ease-in · cubic',f:EZ.inC,col:'#ff5f57'},
  {n:'감속',en:'ease-out · cubic',f:EZ.outC,col:'#3ecf8e'},
  {n:'가속 + 감속',en:'ease-in-out · cubic',f:EZ.inOutC,col:'#6fd3ff'},
  {n:'급감속',en:'ease-out · expo',f:EZ.outExpo,col:'#b49cff'},
  {n:'살짝 넘침',en:'ease-out · back',f:EZ.outBack,col:'#ffcf5a'},
  {n:'출렁임',en:'ease-out · elastic',f:EZ.outElastic,col:'#ff8a3d'},
  {n:'튕김',en:'ease-out · bounce',f:EZ.outBounce,col:'#ff7ab8'}
];
ER.forEach(e=>{let pk=0;for(let i=0;i<400;i++){const d=(e.f((i+1)/400)-e.f(i/400))*400;if(Math.abs(d)>pk)pk=Math.abs(d);}e.pk=pk;e.ov=Math.max(0,ezMax(e.f)-1);});
const R74={T0:.5,T1:2.1,X0:112,W:250};

const demo = {
  dur: 3.6, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const u=seg(t,R74.T0,R74.T1),FX=R74.X0+R74.W;
    /* 도착선 */
    c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=1;c.setLineDash([3,3]);c.beginPath();c.moveTo(FX+.5,24);c.lineTo(FX+.5,292);c.stroke();c.setLineDash([]);
    txtk(c,'도착',FX,20,8.5,'#8b94a3','center');txtk(c,'출발',R74.X0,20,8.5,'#8b94a3','center');
    ER.forEach((e,i)=>{
      const f=a?e.f:EZ.linear,y=28+i*33,cy=y+16,col=a?e.col:'#8b94a3';
      rr(c,8,y+1,624,31,6);c.fillStyle=i%2?'rgba(255,255,255,.015)':'rgba(255,255,255,.03)';c.fill();
      c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=1;c.beginPath();c.moveTo(R74.X0,cy+.5);c.lineTo(FX+60,cy+.5);c.stroke();
      txt2(c,a?e.n:'등속',16,y+14,11.5,col,700);txtm(c,a?e.en:'linear',16,y+25,7.5,'#6a7385');
      /* 잔상: 0.07초 간격으로 지나온 자리 → 간격이 곧 속도 */
      for(let k=7;k>=1;k--){const uk=seg(t-k*.07,R74.T0,R74.T1);if(uk<=0||uk>=u)continue;const vx=R74.X0+f(uk)*R74.W;ezBall(c,vx,cy,6.5-k*.35,col,(1-k/8)*.5);}
      const v=f(u),bx=R74.X0+v*R74.W;ezShadow(c,bx,cy+9,9,3,.4);ezBall(c,bx,cy,8,col);
      if(t>R74.T1&&t<R74.T1+.35){const q=(t-R74.T1)/.35;c.strokeStyle=col;c.globalAlpha=.6*(1-q);c.lineWidth=1.5;c.beginPath();c.arc(FX,cy,8+12*EZ.outC(q),0,TAU);c.stroke();c.globalAlpha=1;}
      ezPlot(c,f,504,y+4,66,24,col,u);
      txtk(c,'속도 ×'+(a?e.pk:1).toFixed(1),578,y+14,8,a?'#dfe5ee':'#8b94a3');txtk(c,'넘침 +'+Math.round(a?e.ov*100:0)+'%',578,y+25,8,a&&e.ov>0.001?'#ffb27f':'#6a7385');
    });
    txtk(c,'t = '+Math.max(0,Math.min(1.6,t-R74.T0)).toFixed(2)+' / 1.60초 · 거리 같음 · 시간 같음',16,312,9.5,'#9ba3ad');
    txtk(c,a?'속도 ×N = 가장 빠른 순간 ÷ 평균 속도':'연출 전: 8개 모두 같은 곡선(직선)',16,326,9,a?'#ff8a3d':'#ff7a70');
    cap(c,a?'연출 후: 곡선(이징)만 바꿨는데 8가지 다른 느낌 — 같은 1.6초·같은 거리':'연출 전: 전부 등속 — 출발과 도착이 기계처럼 딱딱함',16,350);
  }
};
export default demo;
