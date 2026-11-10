// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d57. 직접 고치지 않는다 — 응용 팁 'gap' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { cap, clipArt, txt2, txtm, uiReset } from "./shared/common.js";

const SPL=[
  {n:'단일 화면',r:[[0,0,1,1],[1,0,0,1],[1,1,0,0],[0,1,0,0]],a:[1,0,0,0],rad:0},
  {n:'2분할',r:[[0,0,.5,1],[.5,0,.5,1],[.5,.5,.0,.0],[0,.5,0,0]],a:[1,1,0,0],rad:0},
  {n:'3분할',r:[[0,0,.5,1],[.5,0,.5,.5],[.5,.5,.5,.5],[0,.5,0,0]],a:[1,1,1,0],rad:0},
  {n:'4분할 그리드',r:[[0,0,.5,.5],[.5,0,.5,.5],[0,.5,.5,.5],[.5,.5,.5,.5]],a:[1,1,1,1],rad:0},
  {n:'PIP 화면 속 화면',r:[[0,0,1,1],[.62,.6,.34,.34],[.62,.6,.34,.34],[.62,.6,.34,.34]],a:[1,1,0,0],rad:12},
  {n:'PIP 위치 이동',r:[[0,0,1,1],[.04,.06,.34,.34],[.04,.06,.34,.34],[.04,.06,.34,.34]],a:[1,1,0,0],rad:12}
];
const SPL_T=[.8,1.9,3.0,4.1,5.2];

const demo = {
  dur: 6.4, rest: 3.4, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#000';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);c.fillStyle='#000';c.fillRect(0,0,640,360);
    let li=0;while(li<5&&t>=SPL_T[li])li++;      /* 지금 레이아웃 번호 */
    const prev=Math.max(0,li-1),st=li>0?SPL_T[li-1]:0,e=a&&li>0?E.inOutC(seg(t,st,st+.55)):(li>0?1:0);
    const L0=SPL[prev],L1=SPL[li],ph=a?(e<.5?prev:li):li;
    for(let i=0;i<4;i++){
      const ra=a?L0.r[i].map((v,k)=>v+(L1.r[i][k]-v)*e):L1.r[i],al=a?L0.a[i]+(L1.a[i]-L0.a[i])*e:L1.a[i],rad=a?L0.rad+(L1.rad-L0.rad)*e:L1.rad;
      if(al<.02||ra[2]<.01||ra[3]<.01)continue;
      const g=li>=1?4:0,x=ra[0]*640+g,y=ra[1]*360+g,w=ra[2]*640-g*2,h=ra[3]*360-g*2,pip=rad>6;
      c.save();c.globalAlpha=al;
      if(pip){c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=22;c.shadowOffsetY=10;rr(c,x,y,w,h,rad);c.fillStyle='#000';c.fill();c.shadowColor='transparent';c.shadowBlur=0;}
      rr(c,x,y,w,h,rad);c.clip();clipArt(c,x,y,w,h,i,t+i*1.3);
      c.restore();c.save();c.globalAlpha=al;
      if(pip){rr(c,x,y,w,h,rad);c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=2;c.stroke();}
      rr(c,x+8,y+8,52,16,8);c.fillStyle='rgba(0,0,0,.6)';c.fill();txtm(c,'CAM '+(i+1),x+34,y+19.5,9,'#f4efe4','center');c.restore();
    }
    rr(c,244,14,152,22,11);c.fillStyle='rgba(0,0,0,.7)';c.fill();txt2(c,SPL[ph].n,320,29,12,'#ffb27f',700,'center');
    cap(c,a?'레이아웃 틀(사각형 위치·크기)이 부드럽게 바뀜 · 칸 사이 1.5px 틈 · PIP는 둥근 모서리·그림자·테두리':'연출 전: 레이아웃이 컷으로 바뀜 → 칸이 어디서 왔는지 따라갈 수 없음',16,352);
  }
};
export default demo;
