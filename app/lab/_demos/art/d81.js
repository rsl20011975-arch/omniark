// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d81. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, rng, canvas, rr } from "./helpers.js";
import { DV, EZ, TAU, bgFill, cap, dvChip, dvHair, sstep, txt2, txtk, uiReset } from "./shared/common.js";

const D81=(function(){
  const r=rng(11),pts=[];for(let i=0;i<28;i++){const x=1+r()*14;pts.push({x,y:Math.max(8,Math.min(96,80-3.1*x+(r()-.5)*24))});}
  pts.push({x:9.3,y:76});pts.sort((p,q)=>p.x-q.x);
  const n=pts.length,mx=pts.reduce((s,p)=>s+p.x,0)/n,my=pts.reduce((s,p)=>s+p.y,0)/n;let sxy=0,sxx=0,syy=0;pts.forEach(p=>{sxy+=(p.x-mx)*(p.y-my);sxx+=(p.x-mx)*(p.x-mx);syy+=(p.y-my)*(p.y-my);});
  const slope=sxy/sxx,icp=my-slope*mx,rr_=sxy/Math.sqrt(sxx*syy);let hi=0,mxr=-1e9;pts.forEach((p,i)=>{p.res=p.y-(icp+slope*p.x);if(p.res>mxr){mxr=p.res;hi=i;}});
  return {pts,slope,icp,r:rr_,hi};
})();

const demo = {
  dur: 4.8, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const PX=76,PY=40,PW=516,PH=230,X=x=>PX+x/16*PW,Y=y=>PY+PH-y/100*PH,P=D81;
    dvChip(c,a?'점(흐림) + 추세선 + 한 점 강조':'점마다 숫자 · 추세선 없음',a?226:216,a?'#ffb27f':'#dfe5ee');
    [0,25,50,75,100].forEach(v=>{dvHair(c,PX,Y(v),PX+PW,Y(v),v?DV.grid:DV.axis);txtk(c,v+'%',PX-8,Y(v)+3.5,9.5,DV.muted,'right');});
    [0,4,8,12,16].forEach(v=>{txtk(c,String(v),X(v),PY+PH+16,9.5,DV.muted,'center');});
    txtk(c,'영상 길이(분)',PX+PW/2,PY+PH+31,10,DV.sec,'center');txtk(c,'평균 시청 비율',PX-8,PY-10,10,DV.sec,'right');
    P.pts.forEach((p,i)=>{
      const t0=a?.4+i*.035:.4,u=seg(t,t0,t0+.35);if(u<=.01)return;const sc=EZ.outBack(u),hot=a&&i===P.hi&&t>2.9;
      c.fillStyle=hot?DV.orange:(a?'#6b7a95':DV.blue);c.strokeStyle=DV.surf;c.lineWidth=2;c.beginPath();c.arc(X(p.x),Y(p.y),(hot?7:a?5:4.6)*sc,0,TAU);c.stroke();c.fill();
      if(!a)txtk(c,String(Math.round(p.y)),X(p.x)+6,Y(p.y)-5,9.5,'#9ba3ad');
    });
    if(a){
      const u=EZ.outC(seg(t,1.8,2.7)),xa=.5,xb=.5+15*u;if(u>0){c.strokeStyle=DV.blue;c.lineWidth=2.2;c.lineCap='round';c.beginPath();c.moveTo(X(xa),Y(P.icp+P.slope*xa));c.lineTo(X(xb),Y(P.icp+P.slope*xb));c.stroke();c.lineCap='butt';}
      if(t>2.9){const h=P.pts[P.hi],e=EZ.outC(seg(t,2.9,3.5)),ty=Y(P.icp+P.slope*h.x);c.strokeStyle=DV.orange;c.lineWidth=1.6;c.beginPath();c.moveTo(X(h.x),ty);c.lineTo(X(h.x),ty+(Y(h.y)-ty)*e);c.stroke();
        const pul=Math.max(0,1-(t-2.9)/.8);c.strokeStyle='rgba(255,138,61,'+.7*pul+')';c.lineWidth=1.5;c.beginPath();c.arc(X(h.x),Y(h.y),7+16*(1-pul),0,TAU);c.stroke();
        c.globalAlpha=sstep(3.2,3.7,t);rr(c,X(h.x)+14,Y(h.y)-12,176,34,8);c.fillStyle='rgba(20,24,36,.92)';c.fill();c.strokeStyle='rgba(255,138,61,.6)';c.lineWidth=1;c.stroke();
        txt2(c,'같은 길이 평균보다 +'+Math.round(h.res)+'%p',X(h.x)+24,Y(h.y)+3,11.5,'#ffd9b0',700);txtk(c,'이 영상만 따로 뜯어볼 것',X(h.x)+24,Y(h.y)+17,9.5,DV.sec);c.globalAlpha=1;}
    }
    txtk(c,a?'추세: 길이 1분 늘면 시청 비율 '+P.slope.toFixed(1)+'%p · 상관계수 r = '+P.r.toFixed(2)+' · 점 '+P.pts.length+'개(예시 데이터)':'점 '+P.pts.length+'개 모두에 숫자 · 추세선 없음 · 어느 점이 중요한지 모름',16,330,10,a?'#3ecf8e':'#ff7a70');
    cap(c,a?'연출 후: 점은 회색 파랑으로 물러나고, 추세선이 방향을 말하고, 주황 한 점만 이야기의 주인공':'연출 전: 모든 점이 같은 색, 모든 점에 숫자 — 점 수만큼 글자가 겹쳐 읽히지 않는다',16,350);
  }
};
export default demo;
